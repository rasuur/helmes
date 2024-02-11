package com.example.helmes.service;

import com.example.helmes.exception.InvalidEntryException;
import com.example.helmes.model.Entry;
import com.example.helmes.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EntryService {

	private EntryRepository entryRepository;

	@Autowired
	public void EntryService(EntryRepository entryRepository) {
		this.entryRepository = entryRepository;
	}

	public Entry addEntry(Entry entry) throws InvalidEntryException {
		if (entry == null || entry.getName() == null || entry.getSectors() == null || entry.getSectors().isEmpty()
				|| !entry.isAgreeToTerms()) {
			throw new InvalidEntryException("Invalid entry");
		}

		if (entry.getId() != null) {
			Entry existingEntry = getEntry(entry.getId());
			if (!Objects.equals(existingEntry.getSessionId(), entry.getSessionId())) {
				throw new InvalidEntryException("Session ID mismatch");
			}
		}

		if (!checkIfStringIsAllLetters(entry.getName())) {
			throw new InvalidEntryException("Name must contain only letters and spaces");
		}

		return entryRepository.save(entry);
	}

	public Entry getEntry(Integer id) {
		return entryRepository.findById(id).orElse(null);
	}

	public boolean checkIfStringIsAllLetters(String text) {
		Pattern p = Pattern.compile("^[ A-Za-z]+$");
		Matcher m = p.matcher(text);
		return m.matches();
	}
}
