// IMPORTANT: Indentations are important for docker compose files.
// DO NOT change indentation
export const dockerComposeTemplate = ({ wordpressVersion, mysqlVersion, wordpressPort, databasePort, mysqlDatabase, mysqlUser, mysqlPassword, mysqlRootPassword }) => {
  return `
version: "3.8"

services:
  database:
    image: mysql:${mysqlVersion}
    restart: unless-stopped
    ports:
      - "${databasePort}:${databasePort}"
    expose:
      - "${databasePort}"
    environment:
      MYSQL_ROOT_PASSWORD: "${mysqlRootPassword}"
      MYSQL_DATABASE: "${mysqlDatabase}"
      MYSQL_USER: "${mysqlUser}"
      MYSQL_PASSWORD: "${mysqlPassword}"
      MYSQL_TCP_PORT: "${databasePort}"
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - wordpress-network
    deploy:
      resources:
        limits:
          memory: 2048m
  wordpress:
    depends_on:
      - database
    image: wordpress:${wordpressVersion}
    restart: unless-stopped
    ports:
      - "${wordpressPort}:80"
    environment:
      WORDPRESS_DB_HOST: database:${databasePort}
      WORDPRESS_DB_NAME: "${mysqlDatabase}"
      WORDPRESS_DB_USER: "${mysqlUser}"
      WORDPRESS_DB_PASSWORD: "${mysqlPassword}"
    volumes:
      - ./wordpress:/var/www/html
    networks:
      - wordpress-network

volumes:
  db-data:

networks:
  wordpress-network:
    driver: bridge
`;
};
