Public class Item() {
    String name;
    int num;

    //CONSTRUCTORS
    /**
     * Creates item
     * par newName: name of item. Default: "" 
     * par newNum: number of items. Default: 0
     */
    Item(newName, newNum) {
        this.name = newName;
        this.num = newNum;
    }

    Item(newName) {
        self(newName, 0);
    }

    Item() {
        self("")
    }

    //GETTERS

    public static void getName() {
        return this.name;
    }

    public static void getNum() {
        return this.num
    }

    //SETTERS

    /**
     * Sets name of item
     * Possible names: plantA
     */
    public static void setName(String newName) {
        this.name = newName; //If you change the name make sure you also adjust the number
    }

    public static void setNum(newNum) {
        this.num = newNum;
    }

    //MODIFIERS

    public static void add(dNum) {
        this.num += dNum;
    }

    public static void add() {
        this.num += 1;
    }

    public static void remove(dNum) {
        this.num -= dNum;
    }

    public static void remove() {
        this.num -= 1;
    }



}