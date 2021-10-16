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
		String language = "en-US";
		try {
			System.out.println("                                        \n" +
					"                   *****,.,*****        \n" +
					"                .**            ***      \n" +
					"         *********               **     \n" +
					"       ***                        **    \n" +
					"      **,       **    **     *    ****  \n" +
					"   ******      ,*    **      **      ***\n" +
					" ***           **    **     **        **\n" +
					" **          *****     ***,           **\n" +
					" ,**                                *** \n" +
					"    ********************************    \n");
			System.out.println("Hello, please enter your language. Available options: de, en");
			System.out.println("Hallo, bitte gib deine Sprache ein. Mögliche Optionen: de, en");
			String line = "";
			while (true) {
				line = br.readLine();
				if (line.equals("")) { //skip empty lines
					continue;
				}
				if (line.equals("de")) { // quit the application
					language = "de-DE";
					break;
				}
				if (line.equals("en")) { // quit the application
					language = "en-US";
					break;
				}
			}
			if(language.equals("en-US")) {
				System.out.println("Welcome at Cloud 10.");
				System.out.println("The store one above cloud 9");
				System.out.println("Please describe your wish.");
				System.out.println("You can quit with 'q'");
			} else {
				System.out.println("Hallo willkommen bei Cloud 10.");
				System.out.println("Dem Store eins über der Wolke 9");
				System.out.println("Bitte beschreiben sie Ihr anliegen.");
				System.out.println("Du kannst diesen Chat mit 'q' verlassen");
			}
			while (true) {
				line = br.readLine();
				if (line.equals("")) { //skip empty lines
					continue;
				}
				if (line.equals("q")) { // quit the application
					break;
				}
				CustomRequestBuilder.detectIntentTexts("cloud10-espf", line, "abcde", language, bm);
			}
			System.out.println("Goodbye");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
