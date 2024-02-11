package com.example.helmes.service;

import com.example.helmes.model.Sector;
import com.example.helmes.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectorService {
	private SectorRepository sectorRepository;

	@Autowired
	public void SectorService(SectorRepository sectorRepository) {
		this.sectorRepository = sectorRepository;
	}

	public List<Sector> getAllSectors() {
		return sectorRepository.findAll();
	}
}
