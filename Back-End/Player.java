public class Player extends WorldObject {
    invtySize = 20; //inventory size
    Item[invtySize] invty; //array of inventory items

    //CONSTRUCTORS

    Player() {
        for(int i in range(invtySize)) {
            inventory[i] = new Item("");
        }
    }

    /**
     * Adds item to inventory
     */
    public void addItem(String itemName, int num) {
        for(int i in range(invtySize)) {
            if(invty[i].getName() == itemName) {
                invty[i].add(num);
                //TODO make this change the number shown in the inventory on screen
                return
            }
        }

        for (int i in range(invtySize)) {
            if(invty[i].getName == ItemName) {
                invty[i].setName(itemName);
                invty[i].setNum(num);
                //TODO make this change image + number on inventory
                return
            }
        }

        //TODO if the code gets here it means inventory is full, make a message about that appear
    }

    public void addItem(String itemName) {
        addItem(itemName, 1);
    }
}