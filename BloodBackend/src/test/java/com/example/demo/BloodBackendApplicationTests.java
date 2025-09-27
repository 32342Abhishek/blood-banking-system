package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BloodBackendApplicationTests {

	@LocalServerPort
	private int port;

	@Autowired
	private ApplicationContext context;

	@Test
	void contextLoads() {
		// Test that the application context loads successfully
		assertThat(context).isNotNull();
	}

	@Test
	void applicationStarts() {
		// Just a simple test to verify the application starts without errors
		assertThat(port).isGreaterThan(0);
	}
}
