package ch.ost.aif.dialogflow.main;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import ch.ost.aif.book.BookManager;
import ch.ost.aif.dialogflow.dialogflow.CustomRequestBuilder;

public class Terminal {
	public static void main(String[] args) {
		BookManager bm = new BookManager();
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		try {
			System.out.println("Hallo, please enter a line for the client and confirm with enter, q for quit, c to check the phone book.");
			String line = "";
			while (true) {
				line = br.readLine();
				if (line.equals("")) { //skip empty lines
					continue;
				}
				if (line.equals("q")) { // quit the application
					break;
				}
				if (line.equals("c")) { // check the phonebook
					System.out.println(bm.toString());
					continue;
				}
				CustomRequestBuilder.detectIntentTexts("cloud10-espf", line, "abcde", "en-US", bm);
			}
			System.out.println("Goodbye");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
