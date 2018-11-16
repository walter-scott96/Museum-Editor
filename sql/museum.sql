-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 16, 2018 at 03:30 AM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `museum`
--

-- --------------------------------------------------------

--
-- Table structure for table `contain`
--

DROP TABLE IF EXISTS `contain`;
CREATE TABLE IF NOT EXISTS `contain` (
  `tname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  PRIMARY KEY (`tname`,`lname`),
  KEY `lname` (`lname`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contain`
--

INSERT INTO `contain` (`tname`, `lname`) VALUES
('City Tour', 'Bridge'),
('City Tour', 'Church'),
('City Tour', 'Town Hall'),
('Nature', 'Lake'),
('Nature', 'River Walk');

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
CREATE TABLE IF NOT EXISTS `image` (
  `filename` varchar(256) NOT NULL,
  `isThumbnail` tinyint(1) NOT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `iname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`filename`),
  KEY `lname` (`lname`),
  KEY `iname` (`iname`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `image`
--

INSERT INTO `image` (`filename`, `isThumbnail`, `lname`, `iname`) VALUES
('thumb-hat 1.jpg', 1, NULL, 'Hat'),
('hat 2.JPG', 0, NULL, 'Hat'),
('hat 1.jpg', 0, NULL, 'Hat'),
('coin2.jpg', 0, NULL, 'Coin'),
('coin3.jpg', 0, NULL, 'Coin'),
('coin4.jpg', 0, NULL, 'Coin'),
('thumb-coin1.jpg', 1, NULL, 'Coin'),
('statue2.jpg', 0, NULL, 'Statue'),
('statue3.jpg', 0, NULL, 'Statue'),
('thumb-statue1.JPG', 1, NULL, 'Statue'),
('bridge.jpg', 0, 'Bridge', NULL),
('bridge2.jpg', 0, 'Bridge', NULL),
('bridge3.jpg', 0, 'Bridge', NULL),
('thumb-bridge2.jpg', 1, 'Bridge', NULL),
('lake1.jpg', 0, 'Lake', NULL),
('lake2.jpg', 0, 'Lake', NULL),
('lake4.jpg', 0, 'Lake', NULL),
('thumb-lake3.jpg', 1, 'Lake', NULL),
('church2.jpg', 0, 'Church', NULL),
('church3.jpg', 0, 'Church', NULL),
('thumb-church1.jpg', 1, 'Church', NULL),
('town hall 1.jpg', 0, 'Town Hall', NULL),
('town hall 2.jpg', 0, 'Town Hall', NULL),
('town hall 3.jpg', 0, 'Town Hall', NULL),
('thumb-town hall 3.jpg', 1, 'Town Hall', NULL),
('river walk 2.jpg', 0, 'River Walk', NULL),
('river walk 3.jpg', 0, 'River Walk', NULL),
('thumb-river walk 1.jpg', 1, 'River Walk', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
CREATE TABLE IF NOT EXISTS `item` (
  `name` varchar(100) NOT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`name`, `description`, `category`) VALUES
('Hat', 'An old time hat.', 'Clothing'),
('Coin', 'A coin from ancient times.', 'Ancient'),
('Statue', 'A statue from ancient period in China.', 'Ancient');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
  `name` varchar(100) NOT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lon` decimal(11,8) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`name`, `description`, `lat`, `lon`) VALUES
('Bridge', 'Bridge in the middle of the town.', '-37.89920716', '175.47415090'),
('Lake', 'A nice lake near the town.', '-37.93187096', '175.54270003'),
('Church', 'Old church along the main road.', '-37.88962186', '175.46598698'),
('Town Hall', 'Main hall in the town. Meetings and things happen here.', '-37.89290572', '175.46906840'),
('River Walk', 'A nice walk along the river.', '-37.89593312', '175.45603089');

-- --------------------------------------------------------

--
-- Table structure for table `related`
--

DROP TABLE IF EXISTS `related`;
CREATE TABLE IF NOT EXISTS `related` (
  `lname` varchar(100) NOT NULL,
  `iname` varchar(100) NOT NULL,
  PRIMARY KEY (`lname`,`iname`),
  KEY `iname` (`iname`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `related`
--

INSERT INTO `related` (`lname`, `iname`) VALUES
('Bridge', 'Coin'),
('Lake', 'Hat'),
('River Walk', 'Hat'),
('Town Hall', 'Coin'),
('Town Hall', 'Statue');

-- --------------------------------------------------------

--
-- Table structure for table `tour`
--

DROP TABLE IF EXISTS `tour`;
CREATE TABLE IF NOT EXISTS `tour` (
  `name` varchar(100) NOT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `image` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tour`
--

INSERT INTO `tour` (`name`, `description`, `image`) VALUES
('City Tour', 'Interesting locations around the town.', 'thumb-city.jpg'),
('Nature', 'Some peaceful locations around the town.', 'thumb-testPic5.jpg');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
