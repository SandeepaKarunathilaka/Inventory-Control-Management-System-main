package com.phegondev.InventoryMgtSystem;

import com.inventory.InventoryApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
        classes = InventoryApplication.class,
        properties = {
                "spring.datasource.url=jdbc:h2:mem:inventory_test;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
                "spring.jpa.hibernate.ddl-auto=create-drop"
        }
)
@AutoConfigureMockMvc
class InventoryMgtSystemApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void categoryManagementEndpointsAreAvailable() throws Exception {
		mockMvc.perform(get("/api/categories"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].name").exists());

		mockMvc.perform(get("/api/categories/stats"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalCategories").isNumber())
				.andExpect(jsonPath("$.totalProducts").isNumber());

		mockMvc.perform(get("/api/products"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].categoryName").exists());
	}

}
