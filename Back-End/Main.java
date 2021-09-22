public class Main() {
    public static void main(String[] args) {
        system.out.println("main called")
        //code from https://dzone.com/articles/simple-http-server-in-java
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", 8001), 0);

        server.createContext("/test", new  MyHttpHandler());
        server.setExecutor(threadPoolExecutor);
        server.start();
        logger.info(" Server started on port 8001");
        
        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor)Executors.newFixedThreadPool(10);

        server.start();
    }
}