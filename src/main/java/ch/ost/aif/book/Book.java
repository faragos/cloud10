package ch.ost.aif.book;

import java.util.ArrayList;

public class Book {
	public ArrayList<Entry> entries;

	// create a new phonebook
	public Book() {
		entries = new ArrayList<>();
	}

	// add a new entry, if it isn't in there yet
	public void addEntry(Entry entry) {
		for (Entry e : entries) {
			if (e.getName().equals(entry.getName())) {
				return;
			}
		}
		entries.add(entry);
	}

	// search for an entry by name
	public Entry getEntry(String name) {
		for (Entry e : entries) {
			if (e.getName().equals(name)) {
				return e;
			}
		}
		return null;
	}

	// return all entries with the specified relationship
	public ArrayList<Entry> getGroup(String relationship) {
		ArrayList<Entry> group = new ArrayList<>();
		for (Entry e : entries) {
			if (e.getRelationship().equals(relationship)) {
				group.add(e);
			}
		}
		return group;
	}

	// returns a string with all entries with the specified relationship
	public String getGroupString(String relationship) {
		String s = "Phonebook " + relationship + ": \r\n";
		for (Entry e : getGroup(relationship)) {
			s += e.toString();
			s += "\r\n";
		}
		return s;
	}

	// returns a string with all entries
	public String toString() {
		String s = "Phonebook: \r\n";
		for (Entry e : entries) {
			s += e.toString();
			s += "\r\n";
		}
		return s;
	}
}
