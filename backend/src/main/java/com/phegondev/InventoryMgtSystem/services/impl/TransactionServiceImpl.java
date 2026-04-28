package com.phegondev.InventoryMgtSystem.services.impl;


import com.phegondev.InventoryMgtSystem.dtos.Response;
import com.phegondev.InventoryMgtSystem.dtos.TransactionDTO;
import com.phegondev.InventoryMgtSystem.dtos.TransactionRequest;
import com.phegondev.InventoryMgtSystem.enums.TransactionStatus;
import com.phegondev.InventoryMgtSystem.enums.TransactionType;
import com.phegondev.InventoryMgtSystem.exceptions.NameValueRequiredException;
import com.phegondev.InventoryMgtSystem.exceptions.NotFoundException;
import com.phegondev.InventoryMgtSystem.models.Product;
import com.phegondev.InventoryMgtSystem.models.Supplier;
import com.phegondev.InventoryMgtSystem.models.Transaction;
import com.phegondev.InventoryMgtSystem.models.User;
import com.phegondev.InventoryMgtSystem.repositories.ProductRepository;
import com.phegondev.InventoryMgtSystem.repositories.SupplierRepository;
import com.phegondev.InventoryMgtSystem.repositories.TransactionRepository;
import com.phegondev.InventoryMgtSystem.services.TransactionService;
import com.phegondev.InventoryMgtSystem.services.UserService;
import com.phegondev.InventoryMgtSystem.specification.TransactionFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Response stockIn(TransactionRequest transactionRequest) {

        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if (supplierId == null) throw new NameValueRequiredException("Supplier Id is Required");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        User user = userService.getCurrentLoggedInUser();

        //update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepository.save(product);

        //create a transaction
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.STOCK_IN)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .supplier(supplier)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .note(transactionRequest.getNote())
                .build();

        transactionRepository.save(transaction);
        return Response.builder()
                .status(200)
                .message("Stock-in recorded successfully")
                .build();

    }

    @Override
    public Response stockOut(TransactionRequest transactionRequest) {

        Long productId = transactionRequest.getProductId();
        Integer quantity = transactionRequest.getQuantity();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        User user = userService.getCurrentLoggedInUser();

        if (product.getStockQuantity() < quantity) {
            throw new NameValueRequiredException("Insufficient stock available");
        }

        //update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);


        //create a transaction
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.STOCK_OUT)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .note(transactionRequest.getNote())
                .build();

        transactionRepository.save(transaction);
        return Response.builder()
                .status(200)
                .message("Stock-out recorded successfully")
                .build();


    }

    @Override
    public Response returnToSupplier(TransactionRequest transactionRequest) {

        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if (supplierId == null) throw new NameValueRequiredException("Supplier Id is Required");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        User user = userService.getCurrentLoggedInUser();

        //update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);


        //create a transaction
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.RETURN_TO_SUPPLIER)
                .status(TransactionStatus.PROCESSING)
                .product(product)
                .user(user)
                .totalProducts(quantity)
                .totalPrice(BigDecimal.ZERO)
                .description(transactionRequest.getDescription())
                .note(transactionRequest.getNote())
                .build();

        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Product Returned in progress")
                .build();

    }

    @Override
    public Response getAllTransactions(int page, int size, String filter) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        //user the Transaction specification
        Specification<Transaction> spec = TransactionFilter.byFilter(filter);
        Page<Transaction> transactionPage = transactionRepository.findAll(spec, pageable);

        List<TransactionDTO> transactionDTOS = modelMapper.map(transactionPage.getContent(), new TypeToken<List<TransactionDTO>>() {
        }.getType());

        transactionDTOS.forEach(transactionDTO -> {
            transactionDTO.setUser(null);
            transactionDTO.setProduct(null);
            transactionDTO.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("success")
                .transactions(transactionDTOS)
                .totalElements(transactionPage.getTotalElements())
                .totalPages(transactionPage.getTotalPages())
                .build();

    }

    @Override
    public Response getAllTransactionById(Long id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

        TransactionDTO transactionDTO = modelMapper.map(transaction, TransactionDTO.class);

        transactionDTO.getUser().setTransactions(null);

        return Response.builder()
                .status(200)
                .message("success")
                .transaction(transactionDTO)
                .build();
    }

    @Override
    public Response getAllTransactionByMonthAndYear(int month, int year) {
        List<Transaction> transactions = transactionRepository.findAll(TransactionFilter.byMonthAndYear(month, year));

        List<TransactionDTO> transactionDTOS = modelMapper.map(transactions, new TypeToken<List<TransactionDTO>>() {
        }.getType());

        transactionDTOS.forEach(transactionDTO -> {
            transactionDTO.setUser(null);
            transactionDTO.setProduct(null);
            transactionDTO.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("success")
                .transactions(transactionDTOS)
                .build();
    }

    @Override
    public Response updateTransactionStatus(Long transactionId, TransactionStatus status) {

        Transaction existingTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

        existingTransaction.setStatus(status);
        existingTransaction.setUpdateAt(LocalDateTime.now());

        transactionRepository.save(existingTransaction);

        return Response.builder()
                .status(200)
                .message("Transaction Status Successfully Updated")
                .build();


    }

    @Override
    public Response updateTransaction(Long id, TransactionRequest transactionRequest) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

        Product product = transaction.getProduct();

        int oldQuantity = transaction.getTotalProducts();
        int newQuantity = transactionRequest.getQuantity();
        int stockAdjustment = 0;

        if (transaction.getTransactionType() == TransactionType.STOCK_IN) {
            stockAdjustment = newQuantity - oldQuantity;
        } else if (transaction.getTransactionType() == TransactionType.STOCK_OUT || transaction.getTransactionType() == TransactionType.RETURN_TO_SUPPLIER) {
            stockAdjustment = oldQuantity - newQuantity;
        }

        int newStockQuantity = product.getStockQuantity() + stockAdjustment;

        if (newStockQuantity < 0) {
            throw new NameValueRequiredException("Insufficient stock available for this update");
        }

        product.setStockQuantity(newStockQuantity);
        productRepository.save(product);

        transaction.setTotalProducts(newQuantity);
        transaction.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
        transaction.setDescription(transactionRequest.getDescription());
        transaction.setNote(transactionRequest.getNote());
        transaction.setUpdateAt(LocalDateTime.now());

        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction Updated Successfully")
                .build();
    }

    @Override
    public Response deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

        Product product = transaction.getProduct();

        int quantity = transaction.getTotalProducts();
        int newStockQuantity = product.getStockQuantity();

        if (transaction.getTransactionType() == TransactionType.STOCK_IN) {
            newStockQuantity -= quantity;
            if (newStockQuantity < 0) {
                throw new NameValueRequiredException("Insufficient stock to reverse this stock-in transaction");
            }
        } else if (transaction.getTransactionType() == TransactionType.STOCK_OUT || transaction.getTransactionType() == TransactionType.RETURN_TO_SUPPLIER) {
            newStockQuantity += quantity;
        }

        product.setStockQuantity(newStockQuantity);
        productRepository.save(product);

        transactionRepository.delete(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction Deleted Successfully")
                .build();
    }

    @Override
    public Response getTransactionReport(String startDate, String endDate) {
        Specification<Transaction> spec = Specification.where(null);
        
        if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            spec = TransactionFilter.byDateRange(start, end);
        }

        List<Transaction> transactions = transactionRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "id"));

        List<TransactionDTO> transactionDTOS = modelMapper.map(transactions, new TypeToken<List<TransactionDTO>>() {
        }.getType());

        transactionDTOS.forEach(dto -> {
            if (dto.getUser() != null) dto.getUser().setTransactions(null);
        });

        return Response.builder()
                .status(200)
                .message("Report generated successfully")
                .transactions(transactionDTOS)
                .build();
    }

}
