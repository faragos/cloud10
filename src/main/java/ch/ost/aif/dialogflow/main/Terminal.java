package ch.ost.aif.dialogflow.main;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import ch.ost.aif.dialogflow.dialogflow.CustomRequestBuilder;

public class Terminal {
	public static void main(String[] args) {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
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
			System.out.println("         Welcome to Cloud 10!");
			//System.out.println("the store one above cloud 9");

			String line = "";
			while (true) {
				line = br.readLine();
				if (line.equals("")) { //skip empty lines
					continue;
				}
				if (line.equals("q")) { // quit the application
					break;
				}
				CustomRequestBuilder.detectIntentTexts("cloud10-espf", line, "abcde", "en-US");
			}
			System.out.println("Goodbye");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
