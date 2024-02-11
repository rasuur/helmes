package com.example.helmes.controller;

import com.example.helmes.model.Sector;
import com.example.helmes.service.SectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sectors")
public class SectorController {

	private SectorService sectorService;

	@Autowired
	public void SectorService(SectorService sectorService) {
		this.sectorService = sectorService;
	}

	@GetMapping("/all")
	public List<Sector> getAllSectors() {
		return sectorService.getAllSectors();
	}
}
