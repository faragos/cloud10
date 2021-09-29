package ch.ost.aif.book;

import java.util.Map;

import com.google.protobuf.Struct;
import com.google.protobuf.Value;

public class BookManager {
	private Book book;

	public BookManager() {
		book = new Book();
	}

	public void addEntry(Struct struct) {
		Map<String, Value> m = struct.getFieldsOrThrow("phoneBook").getStructValue().getFieldsMap(); // unpack the Struct
		String name = m.get("name").getStringValue(); // read a field to get the name
		long number = Long.parseLong(m.get("number").getStringValue());
		Entry e = new Entry(name, number); // make a new entry
		e.setRelationship(m.get("relationship").getStringValue()); // enter a relationship, empty string if none provided
		book.addEntry(e); // add the entry to the book
	}

	public void updateEntry(Struct struct) {
		Map<String, Value> m = struct.getFieldsOrThrow("phoneBook").getStructValue().getFieldsMap();
		String name = m.get("name").getStringValue();
		Entry e = book.getEntry(name); // look up the entry
		long number = Long.parseLong(m.get("number").getStringValue());
		if (e != null) { // check if the entry is already made
			e.setNumber(number); // update the entry with the number
		} else {
			System.out.println("The entry with this name couldn't be found");
		}
	}

	public void call(Struct struct) {
		Map<String, Value> m = struct.getFieldsOrThrow("phoneBook").getStructValue().getFieldsMap();
		String name = m.get("name").getStringValue();
		Entry e = book.getEntry(name);
		if (e != null) {
			long number = e.getNumber();
			System.out.println("Calling " + name + " under the number " + number); // make a call
		} else {
			System.out.println("The entry with this name couldn't be found");
		}
	}

	public String getGroup(String relationship) {
		return book.getGroupString(relationship); // find all entries with this relationship
	}

	public String toString() {
		return book.toString(); // find all entries
	}
}
