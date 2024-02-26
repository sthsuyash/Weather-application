-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteCity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeatherSearch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavoriteCity` ADD CONSTRAINT `FavoriteCity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteCity` ADD CONSTRAINT `FavoriteCity_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeatherSearch` ADD CONSTRAINT `WeatherSearch_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeatherSearch` ADD CONSTRAINT `WeatherSearch_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
