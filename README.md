# Memory Game

This is a classic memory game. It can be played by one person or two persons by playing a hot-seat game.
I used for it implementation React, Typescript and classi CSS to make it as easy as possible.

The game count the score of every player (just for multiplayer version but the same logic cand be applied easy also for single player) and at the end displaies who is the winner.

To be able to process the entire logic I used a couple of states to store the main details as:

- nrOfPlayers - is used to store the selected number of players. When the game is restarted this state is set undefined to ask user to select again desired type of game.
- cards - is used to store the info related to the cards displayied on the screen. For every card is stored its id, image url, value, flipped flag. Once the user click on the card and this card is not open and there are no other two cards opened, in this case the card is marked as opened by setting the flipped flag to true. If two cards are opened and they dont match these two cards become closed back after some timeout period. In case of multiplayer regim in such a case the next player can try to guess the cards untill will open unmached cards. The cards become again closed by setting back the flipped flag to false;
  As I mentioned the card also has value field, this field is used as backup in case the images used for cards cannot be loaded. In this case the flipped card will display the value.
- mathedCards - is used to store the ids of the matched cards, to be able to remove these cards from the board.
- playerTurn - is used to set the number of the player which should open the cards. It is used mostly for multiplayer game.
- playerScore - is used to store the score of players based on number of matched cards. Based on it is also calculated who is the winner or is a draw.
- images - store the cats images used for the cards. I tried to load the images just once when the application is loaded and the images a stored during all the time. Even if user click restart the game the same images are used. New images a reload just if the page is reloaded.

The entire logic is preaty clear from the code. If there are any question I am close to answer.

Sure this is the simple version and it can be improved by allowing the user to provide his hame and select more than 2 users.
Also could be an option to allow the user to select number of the cards.
