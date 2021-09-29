package ch.ost.aif.book;

import java.text.DateFormat;

public class Entry {
	// mandatory
	public String name;
	public long number;

	// optional
	public String relationship="";

	// helper
	DateFormat df = DateFormat.getDateInstance();

	public Entry(String name, long number) {
		this.name = name;
		this.number = number;
	}

	public void setRelationship(String rel) {
		this.relationship = rel;
	}
	
	public String getRelationship() {
		return relationship;
	}

	public String getName() {
		return name;
	}

	public long getNumber() {
		return number;
	}

	public void setNumber(long number) {
		this.number = number;
	}

	public String toString() {
		String s = "";
		s += "name: " + name + ", number: " + number;
		return s;
	}
}
