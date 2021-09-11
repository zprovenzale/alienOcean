Public class Item() {
    String name;
    int num;

    //CONSTRUCTORS

    Item(newName, newNum) {
        this.name = newName;
        this.num = newNum;
    }

    Item(newName) {
        self(newName, 0);
    }

    //GETTERS

    public static void getName() {
        return this.name;
    }

    public static void getNum() {
        return this.num
    }

    //SETTERS

    public static void setName(String newName) {
        this.name = newName;
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