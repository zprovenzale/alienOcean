public abstract class WorldObject {

    //CONSTRUCTORS

    WorldObject() {
        int x;
        int y;
        int z;
    }

    //GETTERS

    public static void getX() {
        return this.x;
    }

    public static void getY() {
        return this.y;
    }

    public static void getZ() {
        return this.z;
    }
    
    //SETTERS

    public static void setX(int newX) {
        this.x = newX;
    }

    public static void setY(int newY) {
        this.y = newY;
    }

    public static void setZ(int newZ) {
        this.z = newZ;
    }

    public static void move(int dx, int dy, int dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    public static void move(int dx, int dy) {
        this.move(dx, dy, 0)
    }

    public abstract void draw() {

    }
}
