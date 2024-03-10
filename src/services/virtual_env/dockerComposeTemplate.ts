// IMPORTANT: Indentations are important for docker compose files.
// DO NOT change indentation
export const dockerComposeContent = () => {
  return `
version: "3.8"

services:
  database:
    image: mysql:\${MYSQL_VERSION}
    restart: unless-stopped
    ports:
      - "\${DB_PORT}:\${DB_PORT}"
    expose:
      - "\${DB_PORT}"
    env_file: .env
    environment:
      MYSQL_ROOT_PASSWORD: "\${MYSQL_ROOT_PASSWORD}"
      MYSQL_DATABASE: "\${MYSQL_DATABASE}"
      MYSQL_USER: "\${MYSQL_USER}"
      MYSQL_PASSWORD: "\${MYSQL_PASSWORD}"
      MYSQL_TCP_PORT: "\${DB_PORT}"
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - wordpress-network
    deploy:
      resources:
        limits:
          memory: 2048m

  phpmyadmin:
    depends_on:
      - database
    image: phpmyadmin/phpmyadmin
    restart: unless-stopped
    ports:
      - "\${PHPMYADMIN_PORT}:80"
    env_file: .env
    environment:
      PMA_HOST: database
      MYSQL_ROOT_PASSWORD: "\${MYSQL_ROOT_PASSWORD}"
    networks:
      - wordpress-network

  wordpress:
    depends_on:
      - database
    image: wordpress:\${WORDPRESS_VERSION}
    restart: unless-stopped
    ports:
      - "\${WORDPRESS_PORT}:80"
    env_file: .env
    environment:
      WORDPRESS_DB_HOST: database:\${DB_PORT} # use the same name as database service
      WORDPRESS_DB_NAME: "\${MYSQL_DATABASE}"
      WORDPRESS_DB_USER: "\${MYSQL_USER}"
      WORDPRESS_DB_PASSWORD: "\${MYSQL_PASSWORD}"
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
