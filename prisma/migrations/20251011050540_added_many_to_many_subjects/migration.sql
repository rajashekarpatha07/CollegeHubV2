/*
  Warnings:

  - The primary key for the `announcement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `announcementId` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `announcement` table. All the data in the column will be lost.
  - The primary key for the `branch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branchCode` on the `branch` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `branch` table. All the data in the column will be lost.
  - You are about to drop the column `branchName` on the `branch` table. All the data in the column will be lost.
  - You are about to drop the column `regulation` on the `branch` table. All the data in the column will be lost.
  - The primary key for the `material` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `academicYear` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `examType` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `materialType` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `offeringId` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `uploaderId` on the `material` table. All the data in the column will be lost.
  - You are about to drop the `_branchtoelectivegroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_facultybranches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_facultycourses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `announcementtarget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courseoffering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `electivegroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `electivegroupcourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `syllabusunit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[branch_name]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `faculty_id` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_code` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_name` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty_id` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_url` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_code` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_branchtoelectivegroup` DROP FOREIGN KEY `_BranchToElectiveGroup_A_fkey`;

-- DropForeignKey
ALTER TABLE `_branchtoelectivegroup` DROP FOREIGN KEY `_BranchToElectiveGroup_B_fkey`;

-- DropForeignKey
ALTER TABLE `_facultybranches` DROP FOREIGN KEY `_FacultyBranches_A_fkey`;

-- DropForeignKey
ALTER TABLE `_facultybranches` DROP FOREIGN KEY `_FacultyBranches_B_fkey`;

-- DropForeignKey
ALTER TABLE `_facultycourses` DROP FOREIGN KEY `_FacultyCourses_A_fkey`;

-- DropForeignKey
ALTER TABLE `_facultycourses` DROP FOREIGN KEY `_FacultyCourses_B_fkey`;

-- DropForeignKey
ALTER TABLE `announcement` DROP FOREIGN KEY `Announcement_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `announcementtarget` DROP FOREIGN KEY `AnnouncementTarget_announcementId_fkey`;

-- DropForeignKey
ALTER TABLE `announcementtarget` DROP FOREIGN KEY `AnnouncementTarget_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `courseoffering` DROP FOREIGN KEY `CourseOffering_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `courseoffering` DROP FOREIGN KEY `CourseOffering_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `electivegroupcourse` DROP FOREIGN KEY `ElectiveGroupCourse_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `electivegroupcourse` DROP FOREIGN KEY `ElectiveGroupCourse_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `material` DROP FOREIGN KEY `Material_offeringId_fkey`;

-- DropForeignKey
ALTER TABLE `material` DROP FOREIGN KEY `Material_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `material` DROP FOREIGN KEY `Material_uploaderId_fkey`;

-- DropForeignKey
ALTER TABLE `syllabusunit` DROP FOREIGN KEY `SyllabusUnit_offeringId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_branchId_fkey`;

-- DropIndex
DROP INDEX `Announcement_authorId_idx` ON `announcement`;

-- DropIndex
DROP INDEX `Branch_branchCode_key` ON `branch`;

-- DropIndex
DROP INDEX `Branch_branchName_key` ON `branch`;

-- DropIndex
DROP INDEX `Material_offeringId_materialType_idx` ON `material`;

-- DropIndex
DROP INDEX `Material_unitId_fkey` ON `material`;

-- DropIndex
DROP INDEX `Material_uploaderId_idx` ON `material`;

-- AlterTable
ALTER TABLE `announcement` DROP PRIMARY KEY,
    DROP COLUMN `announcementId`,
    DROP COLUMN `authorId`,
    DROP COLUMN `createdAt`,
    ADD COLUMN `faculty_id` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `post_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `target_batch` INTEGER NULL,
    ADD COLUMN `target_branch_code` VARCHAR(10) NULL,
    MODIFY `title` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `branch` DROP PRIMARY KEY,
    DROP COLUMN `branchCode`,
    DROP COLUMN `branchId`,
    DROP COLUMN `branchName`,
    DROP COLUMN `regulation`,
    ADD COLUMN `branch_code` VARCHAR(10) NOT NULL,
    ADD COLUMN `branch_name` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`branch_code`);

-- AlterTable
ALTER TABLE `material` DROP PRIMARY KEY,
    DROP COLUMN `academicYear`,
    DROP COLUMN `examType`,
    DROP COLUMN `filePath`,
    DROP COLUMN `materialId`,
    DROP COLUMN `materialType`,
    DROP COLUMN `offeringId`,
    DROP COLUMN `unitId`,
    DROP COLUMN `uploadedAt`,
    DROP COLUMN `uploaderId`,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `faculty_id` INTEGER NOT NULL,
    ADD COLUMN `file_url` VARCHAR(255) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `subject_code` VARCHAR(10) NOT NULL,
    ADD COLUMN `upload_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `title` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `_branchtoelectivegroup`;

-- DropTable
DROP TABLE `_facultybranches`;

-- DropTable
DROP TABLE `_facultycourses`;

-- DropTable
DROP TABLE `announcementtarget`;

-- DropTable
DROP TABLE `book`;

-- DropTable
DROP TABLE `course`;

-- DropTable
DROP TABLE `courseoffering`;

-- DropTable
DROP TABLE `electivegroup`;

-- DropTable
DROP TABLE `electivegroupcourse`;

-- DropTable
DROP TABLE `syllabusunit`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Student` (
    `roll_number` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,
    `branch_code` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`roll_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faculty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Faculty_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `subject_code` VARCHAR(10) NOT NULL,
    `subject_name` VARCHAR(100) NOT NULL,
    `semester` INTEGER NOT NULL,

    PRIMARY KEY (`subject_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BranchSubject` (
    `branch_code` VARCHAR(10) NOT NULL,
    `subject_code` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`branch_code`, `subject_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionPaper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `exam_year` INTEGER NOT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `upload_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subject_code` VARCHAR(10) NOT NULL,
    `faculty_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_branch_name_key` ON `Branch`(`branch_name`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_branch_code_fkey` FOREIGN KEY (`branch_code`) REFERENCES `Branch`(`branch_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BranchSubject` ADD CONSTRAINT `BranchSubject_branch_code_fkey` FOREIGN KEY (`branch_code`) REFERENCES `Branch`(`branch_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BranchSubject` ADD CONSTRAINT `BranchSubject_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Subject`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Subject`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionPaper` ADD CONSTRAINT `QuestionPaper_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Subject`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionPaper` ADD CONSTRAINT `QuestionPaper_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
