-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 04, 2026 at 09:19 AM
-- Server version: 8.3.0
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aio_mauzo`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_foreign` (`user_id`),
  KEY `activity_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`),
  KEY `activity_logs_created_at_index` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `subject_type`, `subject_id`, `description`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'curl/8.19.0', '2026-08-07 09:42:53', NULL),
(2, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'curl/8.19.0', '2026-08-07 11:50:51', NULL),
(3, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 11:57:52', NULL),
(4, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 11:58:34', NULL),
(5, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 12:10:34', NULL),
(6, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:13:45', NULL),
(7, 1, 'settings.logo_uploaded', 'App\\Models\\Company', 1, 'Logo updated', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:17:53', NULL),
(8, 1, 'settings.logo_removed', 'App\\Models\\Company', 1, 'Logo removed', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:17:58', NULL),
(9, 1, 'settings.logo_uploaded', 'App\\Models\\Company', 1, 'Logo updated', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:18:32', NULL),
(10, 1, 'settings.logo_removed', 'App\\Models\\Company', 1, 'Logo removed', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:18:35', NULL),
(11, 1, 'settings.logo_uploaded', 'App\\Models\\Company', 1, 'Logo updated', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:18:38', NULL),
(12, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0', '2026-08-07 12:19:59', NULL),
(13, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 16:49:12', NULL),
(14, 5, 'auth.login', 'App\\Models\\User', 5, 'Demo Viewer logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 15:38:24', NULL),
(15, 5, 'auth.logout', 'App\\Models\\User', 5, 'Demo Viewer logged out', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 15:38:57', NULL),
(16, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 15:39:18', NULL),
(17, 1, 'customer.created', 'App\\Models\\Customer', 7, 'Created customer \"AIO  BUSINESS  LIMITED\"', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 15:41:10', NULL),
(18, 1, 'auth.login', 'App\\Models\\User', 1, 'System Administrator logged in', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-18 07:36:18', NULL),
(19, 1, 'customer.deleted', 'App\\Models\\Customer', 1, 'Deleted customer \"Serengeti Traders Ltd\"', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-18 08:14:58', NULL),
(20, 1, 'customer.deleted', 'App\\Models\\Customer', 2, 'Deleted customer \"Kilimanjaro Freight Co.\"', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-18 08:15:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('aio-invoice-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:14:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:14:\"customers.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:5:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:16:\"customers.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:14:\"customers.edit\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:16:\"customers.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:13:\"invoices.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:5:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:15:\"invoices.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:13:\"invoices.edit\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:15:\"invoices.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:22:\"invoices.manage_status\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:4;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:13:\"settings.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:4;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:13:\"settings.edit\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:12:\"reports.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:10:\"users.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:12:\"users.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}}s:5:\"roles\";a:5:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:13:\"Administrator\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:7:\"Manager\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:5:\"Sales\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:10:\"Accountant\";s:1:\"c\";s:3:\"web\";}i:4;a:3:{s:1:\"a\";i:5;s:1:\"b\";s:6:\"Viewer\";s:1:\"c\";s:3:\"web\";}}}', 1787078382);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_size` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `logo_position` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'left',
  `primary_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#4F46E5',
  `secondary_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#14B8A6',
  `signature_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signature_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `signature_width` smallint UNSIGNED NOT NULL DEFAULT '150',
  `signature_x` smallint UNSIGNED NOT NULL DEFAULT '0',
  `signature_y` smallint UNSIGNED NOT NULL DEFAULT '0',
  `stamp_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stamp_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `stamp_width` smallint UNSIGNED NOT NULL DEFAULT '150',
  `stamp_rotation` smallint UNSIGNED NOT NULL DEFAULT '0',
  `stamp_opacity` tinyint UNSIGNED NOT NULL DEFAULT '100',
  `stamp_x` smallint UNSIGNED NOT NULL DEFAULT '0',
  `stamp_y` smallint UNSIGNED NOT NULL DEFAULT '0',
  `qr_code_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vrn` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_registration_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_text` text COLLATE utf8mb4_unicode_ci,
  `terms_conditions` text COLLATE utf8mb4_unicode_ci,
  `payment_instructions` text COLLATE utf8mb4_unicode_ci,
  `default_currency_id` bigint UNSIGNED DEFAULT NULL,
  `default_language` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `invoice_prefix` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INV',
  `invoice_number_format` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{PREFIX}-{YEAR}-{NUMBER}',
  `next_invoice_number` int UNSIGNED NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `companies_default_currency_id_foreign` (`default_currency_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `logo_path`, `logo_size`, `logo_position`, `primary_color`, `secondary_color`, `signature_path`, `signature_enabled`, `signature_width`, `signature_x`, `signature_y`, `stamp_path`, `stamp_enabled`, `stamp_width`, `stamp_rotation`, `stamp_opacity`, `stamp_x`, `stamp_y`, `qr_code_path`, `address`, `phone`, `email`, `website`, `tin`, `vrn`, `business_registration_number`, `footer_text`, `terms_conditions`, `payment_instructions`, `default_currency_id`, `default_language`, `invoice_prefix`, `invoice_number_format`, `next_invoice_number`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'AIO Technologies', 'branding/logo/9dc5b437-0ad6-4280-9c72-bcaf4f0112cf.png', 'medium', 'left', '#4F46E5', '#14B8A6', NULL, 0, 150, 0, 0, NULL, 0, 150, 0, 100, 0, 0, NULL, 'Dar es Salaam, Tanzania', '+255 700 000 000', 'info@aiotechnologies.co.tz', 'https://aiotechnologies.co.tz', '100-000-000', '40-000000-A', NULL, 'Thank you for your business.', 'Payment is due within the agreed terms. Late payments may incur additional charges.', 'Please make payment to the bank account or mobile money number listed above and share the payment reference.', 1, 'en', 'INV', '{PREFIX}-{YEAR}-{NUMBER}', 9, 1, '2026-08-07 09:42:23', '2026-08-07 12:18:38');

-- --------------------------------------------------------

--
-- Table structure for table `company_bank_accounts`
--

DROP TABLE IF EXISTS `company_bank_accounts`;
CREATE TABLE IF NOT EXISTS `company_bank_accounts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` bigint UNSIGNED NOT NULL,
  `type` enum('bank','mobile_money') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bank',
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `swift_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` smallint UNSIGNED NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_bank_accounts_company_id_foreign` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
CREATE TABLE IF NOT EXISTS `currencies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange_rate` decimal(18,6) NOT NULL DEFAULT '1.000000',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `currencies_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `code`, `name`, `symbol`, `exchange_rate`, `is_default`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'TZS', 'Tanzanian Shilling', 'TSh', 1.000000, 1, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(2, 'USD', 'US Dollar', '$', 1.000000, 0, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(3, 'EUR', 'Euro', '€', 1.000000, 0, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(4, 'GBP', 'British Pound', '£', 1.000000, 0, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(5, 'KES', 'Kenyan Shilling', 'KSh', 1.000000, 0, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` bigint UNSIGNED DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vrn` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `physical_address` text COLLATE utf8mb4_unicode_ci,
  `postal_address` text COLLATE utf8mb4_unicode_ci,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customers_company_id_foreign` (`company_id`),
  KEY `customers_created_by_foreign` (`created_by`),
  KEY `customers_company_name_index` (`company_name`),
  KEY `customers_phone_index` (`phone`),
  KEY `customers_email_index` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `company_id`, `company_name`, `contact_person`, `phone`, `email`, `tin`, `vrn`, `physical_address`, `postal_address`, `country`, `city`, `notes`, `is_active`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Serengeti Traders Ltd', 'Amina Hassan', '+255 781234322', 'serengeti.traders.ltd@example.com', '243175663', NULL, NULL, NULL, 'Tanzania', 'Dar es Salaam', NULL, 1, 1, '2026-08-07 09:42:25', '2026-08-18 08:14:58', '2026-08-18 08:14:58'),
(2, 1, 'Kilimanjaro Freight Co.', 'John Mushi', '+255 743864813', 'kilimanjaro.freight.co.@example.com', '995552458', NULL, NULL, NULL, 'Tanzania', 'Arusha', NULL, 1, 1, '2026-08-07 09:42:25', '2026-08-18 08:15:02', '2026-08-18 08:15:02'),
(3, 1, 'Zanzibar Spice Exports', 'Fatma Suleiman', '+255 768499256', 'zanzibar.spice.exports@example.com', '733520513', NULL, NULL, NULL, 'Tanzania', 'Zanzibar City', NULL, 1, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(4, 1, 'Mwanza Fisheries Group', 'Peter Nyerere', '+255 715936399', 'mwanza.fisheries.group@example.com', '295896594', NULL, NULL, NULL, 'Tanzania', 'Mwanza', NULL, 1, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(5, 1, 'Dodoma Agri Supplies', 'Grace Mollel', '+255 710062697', 'dodoma.agri.supplies@example.com', '295145230', NULL, NULL, NULL, 'Tanzania', 'Dodoma', NULL, 1, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(6, 1, 'Coastal Logistics Ltd', 'Ibrahim Kassim', '+255 733041334', 'coastal.logistics.ltd@example.com', '973616559', NULL, NULL, NULL, 'Tanzania', 'Tanga', NULL, 1, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(7, NULL, 'AIO  BUSINESS  LIMITED', 'Boniface Balele', '0754500541', 'bonifacebalele@gmail.com', '102234567', NULL, 'Golden Rose Hotel', 'Arusha', 'Tanzania', 'Arusha', NULL, 1, 1, '2026-08-17 15:41:10', '2026-08-17 15:41:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint UNSIGNED DEFAULT NULL,
  `to_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('queued','sent','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'queued',
  `provider_response` text COLLATE utf8mb4_unicode_ci,
  `sent_by` bigint UNSIGNED DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_logs_invoice_id_foreign` (`invoice_id`),
  KEY `email_logs_sent_by_foreign` (`sent_by`),
  KEY `email_logs_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `invoice_template_id` bigint UNSIGNED DEFAULT NULL,
  `currency_id` bigint UNSIGNED NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('draft','sent','viewed','paid','cancelled','overdue') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tax_total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `amount_paid` decimal(15,2) NOT NULL DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `terms` text COLLATE utf8mb4_unicode_ci,
  `prepared_by` bigint UNSIGNED DEFAULT NULL,
  `approved_by` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `duplicated_from` bigint UNSIGNED DEFAULT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_generated_at` timestamp NULL DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  KEY `invoices_company_id_foreign` (`company_id`),
  KEY `invoices_customer_id_foreign` (`customer_id`),
  KEY `invoices_invoice_template_id_foreign` (`invoice_template_id`),
  KEY `invoices_currency_id_foreign` (`currency_id`),
  KEY `invoices_prepared_by_foreign` (`prepared_by`),
  KEY `invoices_approved_by_foreign` (`approved_by`),
  KEY `invoices_created_by_foreign` (`created_by`),
  KEY `invoices_duplicated_from_foreign` (`duplicated_from`),
  KEY `invoices_status_index` (`status`),
  KEY `invoices_invoice_date_index` (`invoice_date`),
  KEY `invoices_due_date_index` (`due_date`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `company_id`, `customer_id`, `invoice_template_id`, `currency_id`, `invoice_number`, `reference`, `invoice_date`, `due_date`, `status`, `subtotal`, `discount_total`, `tax_total`, `grand_total`, `amount_paid`, `notes`, `terms`, `prepared_by`, `approved_by`, `created_by`, `duplicated_from`, `pdf_path`, `pdf_generated_at`, `sent_at`, `viewed_at`, `paid_at`, `cancelled_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, NULL, 1, 'INV-2026-0001', NULL, '2026-07-03', '2026-07-17', 'paid', 625000.00, 31250.00, 106875.00, 700625.00, 700625.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(2, 1, 2, NULL, 1, 'INV-2026-0002', NULL, '2026-07-10', '2026-07-24', 'paid', 580000.00, 29000.00, 99180.00, 650180.00, 650180.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(3, 1, 3, NULL, 1, 'INV-2026-0003', NULL, '2026-07-18', '2026-08-01', 'sent', 1094000.00, 41500.00, 189450.00, 1241950.00, 0.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, '2026-08-07 09:42:25', NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(4, 1, 4, NULL, 1, 'INV-2026-0004', NULL, '2026-07-24', '2026-08-07', 'viewed', 986000.00, 49300.00, 168606.00, 1105306.00, 0.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(5, 1, 5, NULL, 1, 'INV-2026-0005', NULL, '2026-07-28', '2026-08-11', 'draft', 1190000.00, 0.00, 214200.00, 1404200.00, 0.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(6, 1, 6, NULL, 1, 'INV-2026-0006', NULL, '2026-08-04', '2026-08-18', 'sent', 1616000.00, 41200.00, 283464.00, 1858264.00, 0.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, '2026-08-07 09:42:25', NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(7, 1, 1, NULL, 1, 'INV-2026-0007', NULL, '2026-08-06', '2026-08-20', 'draft', 783000.00, 29500.00, 135630.00, 889130.00, 0.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL),
(8, 1, 2, NULL, 1, 'INV-2026-0008', NULL, '2026-08-07', '2026-08-21', 'draft', 2801000.00, 140050.00, 478971.00, 3139921.00, 0.00, 'Thank you for your business.', NULL, 1, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:42:25', '2026-08-07 09:42:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_history`
--

DROP TABLE IF EXISTS `invoice_history`;
CREATE TABLE IF NOT EXISTS `invoice_history` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint UNSIGNED NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_history_user_id_foreign` (`user_id`),
  KEY `invoice_history_invoice_id_created_at_index` (`invoice_id`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_history`
--

INSERT INTO `invoice_history` (`id`, `invoice_id`, `action`, `old_value`, `new_value`, `description`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'created', NULL, NULL, 'Invoice INV-2026-0001 created', 1, '2026-08-07 09:42:25', NULL),
(2, 1, 'status_changed', 'draft', 'sent', 'Status changed from Draft to Sent', 1, '2026-08-07 09:42:25', NULL),
(3, 1, 'status_changed', 'sent', 'viewed', 'Status changed from Sent to Viewed', 1, '2026-08-07 09:42:25', NULL),
(4, 1, 'status_changed', 'viewed', 'paid', 'Status changed from Viewed to Paid', 1, '2026-08-07 09:42:25', NULL),
(5, 2, 'created', NULL, NULL, 'Invoice INV-2026-0002 created', 1, '2026-08-07 09:42:25', NULL),
(6, 2, 'status_changed', 'draft', 'sent', 'Status changed from Draft to Sent', 1, '2026-08-07 09:42:25', NULL),
(7, 2, 'status_changed', 'sent', 'viewed', 'Status changed from Sent to Viewed', 1, '2026-08-07 09:42:25', NULL),
(8, 2, 'status_changed', 'viewed', 'paid', 'Status changed from Viewed to Paid', 1, '2026-08-07 09:42:25', NULL),
(9, 3, 'created', NULL, NULL, 'Invoice INV-2026-0003 created', 1, '2026-08-07 09:42:25', NULL),
(10, 3, 'status_changed', 'draft', 'sent', 'Status changed from Draft to Sent', 1, '2026-08-07 09:42:25', NULL),
(11, 4, 'created', NULL, NULL, 'Invoice INV-2026-0004 created', 1, '2026-08-07 09:42:25', NULL),
(12, 4, 'status_changed', 'draft', 'sent', 'Status changed from Draft to Sent', 1, '2026-08-07 09:42:25', NULL),
(13, 4, 'status_changed', 'sent', 'viewed', 'Status changed from Sent to Viewed', 1, '2026-08-07 09:42:25', NULL),
(14, 5, 'created', NULL, NULL, 'Invoice INV-2026-0005 created', 1, '2026-08-07 09:42:25', NULL),
(15, 6, 'created', NULL, NULL, 'Invoice INV-2026-0006 created', 1, '2026-08-07 09:42:25', NULL),
(16, 6, 'status_changed', 'draft', 'sent', 'Status changed from Draft to Sent', 1, '2026-08-07 09:42:25', NULL),
(17, 7, 'created', NULL, NULL, 'Invoice INV-2026-0007 created', 1, '2026-08-07 09:42:25', NULL),
(18, 8, 'created', NULL, NULL, 'Invoice INV-2026-0008 created', 1, '2026-08-07 09:42:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
CREATE TABLE IF NOT EXISTS `invoice_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint UNSIGNED NOT NULL,
  `tax_id` bigint UNSIGNED DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(12,2) NOT NULL DEFAULT '1.00',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pcs',
  `unit_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_type` enum('percent','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percent',
  `discount_value` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tax_rate` decimal(6,3) NOT NULL DEFAULT '0.000',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sort_order` smallint UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_items_invoice_id_foreign` (`invoice_id`),
  KEY `invoice_items_tax_id_foreign` (`tax_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `tax_id`, `description`, `quantity`, `unit`, `unit_price`, `discount_type`, `discount_value`, `tax_rate`, `subtotal`, `discount_amount`, `tax_amount`, `total`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Network cabling and setup', 5.00, 'pcs', 77000.00, 'percent', 5.00, 18.000, 385000.00, 19250.00, 65835.00, 431585.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(2, 1, 1, 'Website design and development services', 4.00, 'pcs', 60000.00, 'percent', 5.00, 18.000, 240000.00, 12000.00, 41040.00, 269040.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(3, 2, 1, 'Monthly IT support retainer', 5.00, 'pcs', 116000.00, 'percent', 5.00, 18.000, 580000.00, 29000.00, 99180.00, 650180.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(4, 3, 1, 'Network cabling and setup', 1.00, 'pcs', 492000.00, 'percent', 5.00, 18.000, 492000.00, 24600.00, 84132.00, 551532.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(5, 3, 1, 'Cloud hosting and maintenance', 2.00, 'pcs', 169000.00, 'percent', 5.00, 18.000, 338000.00, 16900.00, 57798.00, 378898.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(6, 3, 1, 'Point of sale system installation', 2.00, 'pcs', 132000.00, 'percent', 0.00, 18.000, 264000.00, 0.00, 47520.00, 311520.00, 2, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(7, 4, 1, 'Website design and development services', 2.00, 'pcs', 230000.00, 'percent', 5.00, 18.000, 460000.00, 23000.00, 78660.00, 515660.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(8, 4, 1, 'Monthly IT support retainer', 3.00, 'pcs', 147000.00, 'percent', 5.00, 18.000, 441000.00, 22050.00, 75411.00, 494361.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(9, 4, 1, 'Cloud hosting and maintenance', 1.00, 'pcs', 85000.00, 'percent', 5.00, 18.000, 85000.00, 4250.00, 14535.00, 95285.00, 2, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(10, 5, 1, 'Network cabling and setup', 2.00, 'pcs', 209000.00, 'percent', 0.00, 18.000, 418000.00, 0.00, 75240.00, 493240.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(11, 5, 1, 'Cloud hosting and maintenance', 4.00, 'pcs', 193000.00, 'percent', 0.00, 18.000, 772000.00, 0.00, 138960.00, 910960.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(12, 6, 1, 'Point of sale system installation', 2.00, 'pcs', 396000.00, 'percent', 0.00, 18.000, 792000.00, 0.00, 142560.00, 934560.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(13, 6, 1, 'Monthly IT support retainer', 3.00, 'pcs', 210000.00, 'percent', 5.00, 18.000, 630000.00, 31500.00, 107730.00, 706230.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(14, 6, 1, 'Monthly IT support retainer', 1.00, 'pcs', 194000.00, 'percent', 5.00, 18.000, 194000.00, 9700.00, 33174.00, 217474.00, 2, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(15, 7, 1, 'Consulting services', 2.00, 'pcs', 295000.00, 'percent', 5.00, 18.000, 590000.00, 29500.00, 100890.00, 661390.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(16, 7, 1, 'Website design and development services', 1.00, 'pcs', 193000.00, 'percent', 0.00, 18.000, 193000.00, 0.00, 34740.00, 227740.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(17, 8, 1, 'Consulting services', 3.00, 'pcs', 419000.00, 'percent', 5.00, 18.000, 1257000.00, 62850.00, 214947.00, 1409097.00, 0, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(18, 8, 1, 'Consulting services', 4.00, 'pcs', 386000.00, 'percent', 5.00, 18.000, 1544000.00, 77200.00, 264024.00, 1730824.00, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_templates`
--

DROP TABLE IF EXISTS `invoice_templates`;
CREATE TABLE IF NOT EXISTS `invoice_templates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preview_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `config` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_templates_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_templates`
--

INSERT INTO `invoice_templates` (`id`, `name`, `slug`, `preview_image`, `is_default`, `config`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Modern', 'modern', NULL, 1, '{\"layout\": \"modern\"}', 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_04_085617_create_personal_access_tokens_table', 1),
(5, '2026_08_04_085629_create_permission_tables', 1),
(6, '2026_08_04_100001_create_currencies_table', 1),
(7, '2026_08_04_100002_create_taxes_table', 1),
(8, '2026_08_04_100003_create_companies_table', 1),
(9, '2026_08_04_100004_create_company_bank_accounts_table', 1),
(10, '2026_08_04_100005_create_customers_table', 1),
(11, '2026_08_04_100006_create_invoice_templates_table', 1),
(12, '2026_08_04_100007_create_invoices_table', 1),
(13, '2026_08_04_100008_create_invoice_items_table', 1),
(14, '2026_08_04_100009_create_payments_table', 1),
(15, '2026_08_04_100010_create_invoice_history_table', 1),
(16, '2026_08_04_100011_create_email_logs_table', 1),
(17, '2026_08_04_100012_create_activity_logs_table', 1),
(18, '2026_08_04_100013_create_settings_table', 1),
(19, '2026_08_04_100014_create_uploads_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 3),
(4, 'App\\Models\\User', 4),
(5, 'App\\Models\\User', 5);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `recorded_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_invoice_id_foreign` (`invoice_id`),
  KEY `payments_recorded_by_foreign` (`recorded_by`),
  KEY `payments_payment_date_index` (`payment_date`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `invoice_id`, `amount`, `payment_date`, `payment_method`, `reference`, `notes`, `recorded_by`, `created_at`, `updated_at`) VALUES
(1, 1, 700625.00, '2026-07-08', 'Bank Transfer', 'PMT-INV-2026-0001', NULL, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25'),
(2, 2, 650180.00, '2026-07-15', 'Bank Transfer', 'PMT-INV-2026-0002', NULL, 1, '2026-08-07 09:42:25', '2026-08-07 09:42:25');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'customers.view', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(2, 'customers.create', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(3, 'customers.edit', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(4, 'customers.delete', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(5, 'invoices.view', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(6, 'invoices.create', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(7, 'invoices.edit', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(8, 'invoices.delete', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(9, 'invoices.manage_status', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(10, 'settings.view', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(11, 'settings.edit', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(12, 'reports.view', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(13, 'users.view', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(14, 'users.manage', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(2, 'Manager', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(3, 'Sales', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(4, 'Accountant', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(5, 'Viewer', 'web', '2026-08-07 09:42:23', '2026-08-07 09:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(12, 2),
(13, 2),
(1, 3),
(2, 3),
(3, 3),
(5, 3),
(6, 3),
(7, 3),
(1, 4),
(5, 4),
(9, 4),
(10, 4),
(12, 4),
(1, 5),
(5, 5),
(12, 5);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('DMX9XkmhEbY2wGwTaGHo7zrD6TA9LBsgfrvUnMgd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUnZ3emVhWGptZTVYampWV2VBMkE4Z0VXN3pYaTY0bXk5TXhGc0cyYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjY6Imh0dHA6Ly9hcGkuYWlvLW1hdXpvLmxvY2FsIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1788513421),
('Y38JikoWUOBN3vJOfHbcC9u0YVr2O0MPlxLAbqet', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiUXBMRmZLVUlnOGU3WE8zcWZxTVFmSU1qcGN1TFExYVhGblBHUHBpUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly9hcGkuYWlvLW1hdXpvLmxvY2FsL2FwaS9pbnZvaWNlcy84L2VtYWlscyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2NDoiMTBhZGFhYjM4ZGY2NjdhMTBkZjQ2MjA0NWYyNmZmNDA2ZmMyOWM0NWY0NjUxYTRhNzZiY2EwYzQ1YWY3ODAxNiI7fQ==', 1787053407);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` json DEFAULT NULL,
  `group` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxes`
--

DROP TABLE IF EXISTS `taxes`;
CREATE TABLE IF NOT EXISTS `taxes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(6,3) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `taxes`
--

INSERT INTO `taxes` (`id`, `name`, `rate`, `is_default`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'VAT 18%', 18.000, 1, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23'),
(2, 'No Tax', 0.000, 0, 1, '2026-08-07 09:42:23', '2026-08-07 09:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
CREATE TABLE IF NOT EXISTS `uploads` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uploadable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploadable_id` bigint UNSIGNED NOT NULL,
  `disk` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` bigint UNSIGNED DEFAULT NULL,
  `uploaded_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uploads_uploaded_by_foreign` (`uploaded_by`),
  KEY `uploads_uploadable_type_uploadable_id_index` (`uploadable_type`,`uploadable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`id`, `uploadable_type`, `uploadable_id`, `disk`, `path`, `original_name`, `mime_type`, `size`, `uploaded_by`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Company', 1, 'public', 'branding/logo/d9e62822-23e2-43ed-86d9-8e003ec03db8.png', 'logo2.png', 'image/png', 28376, 1, '2026-08-07 12:17:53', '2026-08-07 12:17:53'),
(2, 'App\\Models\\Company', 1, 'public', 'branding/logo/42edfaa2-6fe3-411c-ad93-09a3ab9bceff.png', 'logo.png', 'image/png', 2324, 1, '2026-08-07 12:18:32', '2026-08-07 12:18:32'),
(3, 'App\\Models\\Company', 1, 'public', 'branding/logo/9dc5b437-0ad6-4280-9c72-bcaf4f0112cf.png', 'logo2.png', 'image/png', 28376, 1, '2026-08-07 12:18:38', '2026-08-07 12:18:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_is_active_index` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `avatar_path`, `email_verified_at`, `password`, `is_active`, `last_login_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'System Administrator', 'admin@aio-mauzo.local', NULL, NULL, '2026-08-07 09:42:24', '$2y$12$87hT2zhvBrrF00L80ZvvL.YW4MDhz2Hg8LhYc5t/4EJYPtrw7abci', 1, '2026-08-18 07:36:18', NULL, '2026-08-07 09:42:24', '2026-08-18 07:36:18'),
(2, 'Demo Manager', 'manager@aio-mauzo.local', NULL, NULL, '2026-08-07 09:42:24', '$2y$12$JakT7Io6uAaqIb7qEDwJHOrRhdUgO34JxglIlWfsVUM0p8PRMSIu.', 1, NULL, NULL, '2026-08-07 09:42:24', '2026-08-07 09:42:24'),
(3, 'Demo Sales', 'sales@aio-mauzo.local', NULL, NULL, '2026-08-07 09:42:24', '$2y$12$NEkQPnu49LAYnfMioBMLquaxuVmOtTz./wQIh0hcj8/PpijoijB5e', 1, NULL, NULL, '2026-08-07 09:42:24', '2026-08-07 09:42:24'),
(4, 'Demo Accountant', 'accountant@aio-mauzo.local', NULL, NULL, '2026-08-07 09:42:24', '$2y$12$oWJGU/88nw7/lKyiMxZL5.QcAlt18r041SCo2J7tUWMotC/WwG.Ya', 1, NULL, NULL, '2026-08-07 09:42:24', '2026-08-07 09:42:24'),
(5, 'Demo Viewer', 'viewer@aio-mauzo.local', NULL, NULL, '2026-08-07 09:42:25', '$2y$12$KIfHGkdeKXHDPhXbe34PR.JB3uT4U9eq1nWThrbjwiOa7sPWMkDai', 1, '2026-08-17 15:38:24', NULL, '2026-08-07 09:42:25', '2026-08-17 15:38:24');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_default_currency_id_foreign` FOREIGN KEY (`default_currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `company_bank_accounts`
--
ALTER TABLE `company_bank_accounts`
  ADD CONSTRAINT `company_bank_accounts_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD CONSTRAINT `email_logs_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `email_logs_sent_by_foreign` FOREIGN KEY (`sent_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`),
  ADD CONSTRAINT `invoices_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `invoices_duplicated_from_foreign` FOREIGN KEY (`duplicated_from`) REFERENCES `invoices` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_invoice_template_id_foreign` FOREIGN KEY (`invoice_template_id`) REFERENCES `invoice_templates` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_prepared_by_foreign` FOREIGN KEY (`prepared_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_history`
--
ALTER TABLE `invoice_history`
  ADD CONSTRAINT `invoice_history_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_history_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_items_tax_id_foreign` FOREIGN KEY (`tax_id`) REFERENCES `taxes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `uploads`
--
ALTER TABLE `uploads`
  ADD CONSTRAINT `uploads_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
