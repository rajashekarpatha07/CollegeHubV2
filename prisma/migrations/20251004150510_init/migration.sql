-- CreateTable
CREATE TABLE `Role` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` ENUM('ADMIN', 'STUDENT', 'FACULTY') NOT NULL,

    UNIQUE INDEX `Role_roleName_key`(`roleName`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `loginId` VARCHAR(191) NOT NULL,
    `rollNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,

    UNIQUE INDEX `User_loginId_key`(`loginId`),
    UNIQUE INDEX `User_rollNumber_key`(`rollNumber`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `branchId` INTEGER NOT NULL AUTO_INCREMENT,
    `branchName` VARCHAR(191) NOT NULL,
    `branchCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Branch_branchCode_key`(`branchCode`),
    PRIMARY KEY (`branchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `subjectId` INTEGER NOT NULL AUTO_INCREMENT,
    `subjectName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Subject_subjectName_key`(`subjectName`),
    PRIMARY KEY (`subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseOffering` (
    `offeringId` INTEGER NOT NULL AUTO_INCREMENT,
    `subjectCode` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `regulation` VARCHAR(191) NOT NULL,
    `lectureHours` INTEGER NOT NULL,
    `tutorialHours` INTEGER NOT NULL,
    `practicalHours` INTEGER NOT NULL,
    `credits` DOUBLE NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,

    UNIQUE INDEX `CourseOffering_subjectCode_key`(`subjectCode`),
    PRIMARY KEY (`offeringId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SyllabusUnit` (
    `unitId` INTEGER NOT NULL AUTO_INCREMENT,
    `unitNumber` INTEGER NOT NULL,
    `unitTitle` VARCHAR(191) NOT NULL,
    `offeringId` INTEGER NOT NULL,

    UNIQUE INDEX `SyllabusUnit_offeringId_unitNumber_key`(`offeringId`, `unitNumber`),
    PRIMARY KEY (`unitId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `bookId` INTEGER NOT NULL AUTO_INCREMENT,
    `bookType` ENUM('TEXTBOOK', 'REFERENCE') NOT NULL,
    `bookDetails` TEXT NOT NULL,
    `subjectId` INTEGER NOT NULL,

    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `materialId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `materialType` ENUM('Note', 'PYQP', 'Syllabus') NOT NULL,
    `examType` ENUM('Mid_1', 'Mid_2', 'Semester', 'NA') NOT NULL DEFAULT 'NA',
    `academicYear` INTEGER NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `offeringId` INTEGER NULL,
    `unitId` INTEGER NULL,
    `uploaderId` INTEGER NOT NULL,

    PRIMARY KEY (`materialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `announcementId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` INTEGER NOT NULL,

    PRIMARY KEY (`announcementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnouncementTarget` (
    `targetId` INTEGER NOT NULL AUTO_INCREMENT,
    `announcementId` INTEGER NOT NULL,
    `branchId` INTEGER NULL,
    `semester` INTEGER NULL,

    PRIMARY KEY (`targetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ElectiveGroup` (
    `groupId` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `regulation` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ElectiveGroupSubject` (
    `groupId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    PRIMARY KEY (`groupId`, `subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ElectiveGroupBranch` (
    `groupId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,

    PRIMARY KEY (`groupId`, `branchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseOffering` ADD CONSTRAINT `CourseOffering_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`subjectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseOffering` ADD CONSTRAINT `CourseOffering_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branchId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SyllabusUnit` ADD CONSTRAINT `SyllabusUnit_offeringId_fkey` FOREIGN KEY (`offeringId`) REFERENCES `CourseOffering`(`offeringId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`subjectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_offeringId_fkey` FOREIGN KEY (`offeringId`) REFERENCES `CourseOffering`(`offeringId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `SyllabusUnit`(`unitId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnouncementTarget` ADD CONSTRAINT `AnnouncementTarget_announcementId_fkey` FOREIGN KEY (`announcementId`) REFERENCES `Announcement`(`announcementId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnouncementTarget` ADD CONSTRAINT `AnnouncementTarget_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branchId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ElectiveGroupSubject` ADD CONSTRAINT `ElectiveGroupSubject_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `ElectiveGroup`(`groupId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ElectiveGroupSubject` ADD CONSTRAINT `ElectiveGroupSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`subjectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ElectiveGroupBranch` ADD CONSTRAINT `ElectiveGroupBranch_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `ElectiveGroup`(`groupId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ElectiveGroupBranch` ADD CONSTRAINT `ElectiveGroupBranch_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branchId`) ON DELETE RESTRICT ON UPDATE CASCADE;
