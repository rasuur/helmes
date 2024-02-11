package com.example.helmes.controller;

import com.example.helmes.exception.InvalidEntryException;
import com.example.helmes.model.Entry;
import com.example.helmes.service.EntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entry")
public class EntryController {

	private EntryService entryService;

	@Autowired
	public void EntryService(EntryService entryService) {
		this.entryService = entryService;
	}

	@PostMapping("/add")
	public Entry addEntry(@RequestBody Entry entry) throws InvalidEntryException {
		return entryService.addEntry(entry);
	}
}
