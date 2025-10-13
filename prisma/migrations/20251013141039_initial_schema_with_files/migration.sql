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
CREATE TABLE `Branch` (
    `branch_code` VARCHAR(10) NOT NULL,
    `branch_name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Branch_branch_name_key`(`branch_name`),
    PRIMARY KEY (`branch_code`)
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
CREATE TABLE `Material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `public_id` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `upload_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subject_code` VARCHAR(10) NOT NULL,
    `faculty_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionPaper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `exam_year` INTEGER NOT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `public_id` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `upload_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subject_code` VARCHAR(10) NOT NULL,
    `faculty_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `post_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `faculty_id` INTEGER NOT NULL,
    `target_branch_code` VARCHAR(10) NULL,
    `target_batch` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
