-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: sentinelshield_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sensor_analytics`
--

DROP TABLE IF EXISTS `sensor_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensor_analytics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_events` bigint DEFAULT NULL,
  `normal_events` bigint DEFAULT NULL,
  `person_detections` bigint DEFAULT NULL,
  `fuel_theft_events` bigint DEFAULT NULL,
  `vibration_events` bigint DEFAULT NULL,
  `high_threat_events` bigint DEFAULT NULL,
  `medium_threat_events` bigint DEFAULT NULL,
  `low_threat_events` bigint DEFAULT NULL,
  `average_fuel` double DEFAULT NULL,
  `average_distance` double DEFAULT NULL,
  `average_threat_score` double DEFAULT NULL,
  `maximum_threat_score` double DEFAULT NULL,
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_analytics`
--

LOCK TABLES `sensor_analytics` WRITE;
/*!40000 ALTER TABLE `sensor_analytics` DISABLE KEYS */;
INSERT INTO `sensor_analytics` VALUES (1,6,2,2,1,1,2,2,2,58.5,17.83,40,85,'2026-11-04 16:25:29'),(2,6,2,2,1,1,2,2,2,58.5,17.83,40,85,'2026-11-05 02:57:16'),(3,8,4,2,1,1,2,2,4,61.88,17.13,30,85,'2026-11-05 04:39:37');
/*!40000 ALTER TABLE `sensor_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor_readings`
--

DROP TABLE IF EXISTS `sensor_readings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensor_readings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int DEFAULT NULL,
  `fuel_level` float DEFAULT NULL,
  `distance` float DEFAULT NULL,
  `anomaly` varchar(50) DEFAULT NULL,
  `threat_score` float DEFAULT '0',
  `threat_level` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_readings`
--

LOCK TABLES `sensor_readings` WRITE;
/*!40000 ALTER TABLE `sensor_readings` DISABLE KEYS */;
INSERT INTO `sensor_readings` VALUES (1,1,75,15,'NORMAL',0,'LOW','2026-11-04 15:33:41'),(2,1,72,15,'NORMAL',0,'LOW','2026-11-04 16:21:12'),(3,1,70,12,'PERSON_DETECT',40,'MEDIUM','2026-11-04 16:21:12'),(4,1,45,30,'FUEL_THEFT',75,'HIGH','2026-11-04 16:21:12'),(5,1,45,25,'VIBRATION_DETECT',85,'HIGH','2026-11-04 16:21:12'),(6,1,44,10,'PERSON_DETECT',40,'MEDIUM','2026-11-04 16:21:12'),(7,1,72,15,'NORMAL',0,'LOW','2026-11-05 03:06:28'),(8,1,72,15,'NORMAL',0,'LOW','2026-11-05 03:06:29'),(9,1,0,62,'NORMAL',0,'LOW','2026-11-12 15:59:59'),(10,1,0,49,'NORMAL',0,'LOW','2026-11-12 16:00:03'),(11,1,0,45,'NORMAL',0,'LOW','2026-11-12 16:00:07'),(12,1,0,47,'NORMAL',0,'LOW','2026-11-12 16:00:11'),(13,1,0,45,'NORMAL',0,'LOW','2026-11-12 16:00:15'),(14,1,0,49,'NORMAL',0,'LOW','2026-11-12 16:00:19'),(15,1,0,62,'NORMAL',0,'LOW','2026-11-12 16:00:24'),(16,1,0,65,'NORMAL',0,'LOW','2026-11-12 16:00:27'),(17,1,0,67,'NORMAL',0,'LOW','2026-11-12 16:00:32'),(18,1,0,60,'NORMAL',0,'LOW','2026-11-12 16:00:36'),(19,1,0,61,'NORMAL',0,'LOW','2026-11-12 16:00:40'),(20,1,0,63,'NORMAL',0,'LOW','2026-11-12 16:00:44'),(21,1,0,71,'NORMAL',0,'LOW','2026-11-12 16:00:48'),(22,1,0,71,'NORMAL',0,'LOW','2026-11-12 16:00:52'),(23,1,0,69,'NORMAL',0,'LOW','2026-11-12 16:00:57'),(24,1,0,72,'NORMAL',0,'LOW','2026-11-12 16:01:01'),(25,1,0,66,'NORMAL',0,'LOW','2026-11-12 16:01:05'),(26,1,0,72,'NORMAL',0,'LOW','2026-11-12 16:01:09'),(27,1,0,65,'NORMAL',0,'LOW','2026-11-12 16:01:13'),(28,1,0,69,'NORMAL',0,'LOW','2026-11-12 16:01:17'),(29,1,0,61,'NORMAL',0,'LOW','2026-11-12 16:01:22'),(30,1,0,69,'NORMAL',0,'LOW','2026-11-12 16:01:25'),(31,1,0,61,'NORMAL',0,'LOW','2026-11-12 16:01:30'),(32,1,0,60,'NORMAL',0,'LOW','2026-11-12 16:01:34'),(33,1,0,69,'NORMAL',0,'LOW','2026-11-12 16:01:38'),(34,1,0,57,'NORMAL',0,'LOW','2026-11-12 16:01:42'),(35,1,0,59,'NORMAL',0,'LOW','2026-11-12 16:01:47'),(36,1,0,66,'NORMAL',0,'LOW','2026-11-12 16:01:51'),(37,1,0,70,'NORMAL',0,'LOW','2026-11-12 16:01:56'),(38,1,0,62,'NORMAL',0,'LOW','2026-11-12 16:02:00'),(39,1,0,64,'NORMAL',0,'LOW','2026-11-12 16:02:04'),(40,1,0,59,'NORMAL',0,'LOW','2026-11-12 16:02:08'),(41,1,0,338,'NORMAL',0,'LOW','2026-11-12 16:02:12'),(42,1,0,68,'NORMAL',0,'LOW','2026-11-12 16:02:17'),(43,1,0,856,'NORMAL',0,'LOW','2026-11-12 16:02:21'),(44,1,0,74,'NORMAL',0,'LOW','2026-11-12 16:02:25'),(45,1,0,254,'NORMAL',0,'LOW','2026-11-12 16:02:29'),(46,1,0,856,'NORMAL',0,'LOW','2026-11-12 16:02:33'),(47,1,0,60,'NORMAL',0,'LOW','2026-11-12 16:02:37'),(48,1,0,61,'NORMAL',0,'LOW','2026-11-12 16:02:42'),(49,1,0,56,'NORMAL',0,'LOW','2026-11-12 16:02:46'),(50,1,0,55,'NORMAL',0,'LOW','2026-11-12 16:02:50'),(51,1,0,54,'NORMAL',0,'LOW','2026-11-12 16:02:54'),(52,1,0,855,'NORMAL',0,'LOW','2026-11-12 16:02:58'),(53,1,0,52,'NORMAL',0,'LOW','2026-11-12 16:03:02'),(54,1,0,54,'NORMAL',0,'LOW','2026-11-12 16:03:06'),(55,1,0,52,'NORMAL',0,'LOW','2026-11-12 16:03:11'),(56,1,0,43,'NORMAL',0,'LOW','2026-11-12 16:03:14');
/*!40000 ALTER TABLE `sensor_readings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-13 20:05:09
