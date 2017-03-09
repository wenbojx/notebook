-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2017-03-07 01:39:46
-- 服务器版本： 5.7.16
-- PHP Version: 7.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `notebook`
--

-- --------------------------------------------------------

--
-- 表的结构 `book`
--

CREATE TABLE `book` (
  `id` int(10) NOT NULL,
  `uid` int(10) NOT NULL,
  `title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `shorttitle` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `avatar` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `intro` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `type` int(2) NOT NULL,
  `tags` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `countVolume` int(5) NOT NULL DEFAULT '0',
  `countChapter` int(5) NOT NULL DEFAULT '0',
  `countWords` int(10) NOT NULL DEFAULT '0',
  `creatTime` int(10) NOT NULL,
  `updateTime` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0删除1正常'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='书籍表';

-- --------------------------------------------------------

--
-- 表的结构 `chapter`
--

CREATE TABLE `chapter` (
  `id` int(10) NOT NULL,
  `bookid` int(10) NOT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1卷2章',
  `fid` int(10) NOT NULL,
  `title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `intro` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `countword` int(7) NOT NULL,
  `createtime` int(10) NOT NULL,
  `updatetime` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '1正常',
  `pre` int(10) NOT NULL COMMENT '上章',
  `next` int(10) NOT NULL COMMENT '下章'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `content`
--

CREATE TABLE `content` (
  `id` int(10) NOT NULL,
  `cid` int(10) NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `friends`
--

CREATE TABLE `friends` (
  `id` int(12) NOT NULL,
  `uid` int(10) NOT NULL,
  `fuid` int(10) NOT NULL,
  `addtime` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0删除1正常2黑名单'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='好友';

-- --------------------------------------------------------

--
-- 表的结构 `friendsmsg`
--

CREATE TABLE `friendsmsg` (
  `id` int(11) NOT NULL,
  `uid` int(10) NOT NULL,
  `tuuid` int(10) NOT NULL,
  `msg` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `createtime` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='好友消息';

-- --------------------------------------------------------

--
-- 表的结构 `group`
--

CREATE TABLE `group` (
  `id` int(10) UNSIGNED NOT NULL COMMENT '群ID',
  `name` varchar(250) DEFAULT NULL COMMENT '群名称',
  `u_id` int(10) DEFAULT NULL COMMENT '创建此群的用户ID',
  `avatar` varchar(250) DEFAULT NULL,
  `createtime` int(10) UNSIGNED NOT NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0删除1正常'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `groupmsg`
--

CREATE TABLE `groupmsg` (
  `id` int(11) NOT NULL,
  `gid` int(10) NOT NULL,
  `uid` int(10) NOT NULL,
  `msg` int(11) NOT NULL,
  `createtime` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='群消息';

-- --------------------------------------------------------

--
-- 表的结构 `groupuser`
--

CREATE TABLE `groupuser` (
  `id` int(11) UNSIGNED NOT NULL,
  `g_id` int(10) DEFAULT NULL COMMENT '群ID',
  `uid` int(10) DEFAULT NULL COMMENT '用户ID',
  `jointime` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `passwd` char(32) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0删除1正常2禁用户名登录',
  `createtime` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `passwd`, `status`, `createtime`) VALUES
(10, 'E7D636F5ADF7E7839DCD2865705F81BF', '33b8a4a95aa32d060a67a5e4582677a3', 2, 1480516163),
(11, '2233270B30AB66137AF6A69E6E330249', 'ca02d535b160f28717ae04fc549b6f15', 2, 1480577344);

-- --------------------------------------------------------

--
-- 表的结构 `userbind`
--

CREATE TABLE `userbind` (
  `id` int(10) NOT NULL,
  `uid` int(10) NOT NULL,
  `oauth_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1QQ2微博',
  `oauth_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `access_token` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `userbind`
--

INSERT INTO `userbind` (`id`, `uid`, `oauth_type`, `oauth_id`, `access_token`) VALUES
(4, 10, 1, 'E7D636F5ADF7E7839DCD2865705F81BF', 'C1C394DBDF6E664C9F286C2900943D2A'),
(5, 11, 1, '2233270B30AB66137AF6A69E6E330249', '7EC89860E361CC179280A6708D2E020B');

-- --------------------------------------------------------

--
-- 表的结构 `userinfo`
--

CREATE TABLE `userinfo` (
  `id` int(10) UNSIGNED NOT NULL,
  `uid` int(10) UNSIGNED NOT NULL,
  `nickname` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1男0女',
  `province` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `year` int(4) NOT NULL,
  `figureurl` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '头像'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `userinfo`
--

INSERT INTO `userinfo` (`id`, `uid`, `nickname`, `gender`, `province`, `city`, `year`, `figureurl`) VALUES
(3, 10, '文博', 0, '上海', '浦东新区', 1983, 'http://qzapp.qlogo.cn/qzapp/101358269/E7D636F5ADF7E7839DCD2865705F81BF/30'),
(4, 11, '文博', 0, '上海', '浦东新区', 1983, 'http://qzapp.qlogo.cn/qzapp/101358269/2233270B30AB66137AF6A69E6E330249/30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chapter`
--
ALTER TABLE `chapter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `friendsmsg`
--
ALTER TABLE `friendsmsg`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groupmsg`
--
ALTER TABLE `groupmsg`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groupuser`
--
ALTER TABLE `groupuser`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `username_2` (`username`);

--
-- Indexes for table `userbind`
--
ALTER TABLE `userbind`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `oauth_id` (`oauth_id`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid_3` (`uid`),
  ADD KEY `uid` (`uid`),
  ADD KEY `uid_2` (`uid`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `book`
--
ALTER TABLE `book`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `chapter`
--
ALTER TABLE `chapter`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `content`
--
ALTER TABLE `content`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `friendsmsg`
--
ALTER TABLE `friendsmsg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `group`
--
ALTER TABLE `group`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '群ID';
--
-- 使用表AUTO_INCREMENT `groupmsg`
--
ALTER TABLE `groupmsg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `groupuser`
--
ALTER TABLE `groupuser`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- 使用表AUTO_INCREMENT `userbind`
--
ALTER TABLE `userbind`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- 使用表AUTO_INCREMENT `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
