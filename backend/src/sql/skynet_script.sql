--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: GroupRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GroupRole" AS ENUM (
    'member',
    'admin'
);


ALTER TYPE public."GroupRole" OWNER TO postgres;

--
-- Name: create_feed(character varying, integer, text, character varying, timestamp without time zone, character varying[], integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.create_feed(op_id character varying, group_id integer, content_input text, image_input character varying, created timestamp without time zone, tags character varying[], share_from_feed_id_input integer, INOUT returning_id integer)
    LANGUAGE plpgsql
    AS $$BEGIN

INSERT INTO public."Feed" (original_poster_id, group_id, content, image, created_at, share_from_feed_id)
VALUES (op_id, group_id, content_input, image_input, created, share_from_feed_id_input)
RETURNING id INTO returning_id;

FOR i IN 1..array_length(tags, 1) LOOP
	INSERT INTO public."Tag"(name, feed_ids)
	VALUES (tags[i], ARRAY[returning_id])
	ON CONFLICT (name)
	DO UPDATE
		SET feed_ids = array_append(public."Tag".feed_ids, returning_id);
END LOOP;

COMMIT;
END;$$;


ALTER PROCEDURE public.create_feed(op_id character varying, group_id integer, content_input text, image_input character varying, created timestamp without time zone, tags character varying[], share_from_feed_id_input integer, INOUT returning_id integer) OWNER TO postgres;

--
-- Name: create_group(character varying, character varying, character varying, character varying, character varying[], character varying, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.create_group(avatar character varying, group_name character varying, intro character varying, description character varying, tags character varying[], user_id_input character varying, INOUT returning_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO public."Group"(avatar, name, intro, description)
VALUES (avatar, group_name, intro, description)
RETURNING id INTO returning_id;

FOR i IN 1..array_length(tags, 1) LOOP
	INSERT INTO public."Tag"(name, group_ids)
	VALUES (tags[i], ARRAY[returning_id])
	ON CONFLICT (name)
	DO UPDATE
		SET group_ids = array_append(public."Tag".group_ids, returning_id);
END LOOP;

INSERT INTO public."Group_User"(
	group_id, user_id, role)
VALUES (returning_id, user_id_input, 'admin');
COMMIT;
END;$$;


ALTER PROCEDURE public.create_group(avatar character varying, group_name character varying, intro character varying, description character varying, tags character varying[], user_id_input character varying, INOUT returning_id integer) OWNER TO postgres;

--
-- Name: get_comments(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_comments() RETURNS TABLE(id integer, feed_id integer, content text, "createdAt" timestamp without time zone, "originalPoster" jsonb, replies jsonb)
    LANGUAGE plpgsql
    AS $$BEGIN
   RETURN QUERY SELECT
	public."Comment".id, 
	public."Comment".feed_id AS "feedID",
	public."Comment".content,
	public."Comment".created_at AS "createdAt",
	jsonb_build_object('id', public."User".id, 'fullname', public."User".fullname) AS "originalPoster",
	jsonb_agg(replies.*) filter (WHERE replies.id IS NOT NULL) AS replies
FROM public."Comment"
LEFT JOIN public."User" ON public."User".id = public."Comment".user_id
LEFT JOIN (
	SELECT 
		"Reply".id,
		"Reply".comment_id,
		"Reply".content,
		"Reply".created_at AS "createdAt",
		jsonb_build_object('id', "RepUser".id, 'fullname', "RepUser".fullname) AS "originalPoster"
	FROM public."Reply" AS "Reply"
	LEFT JOIN public."User" AS "RepUser" ON "RepUser".id = "Reply".user_id
) AS replies ON replies.comment_id = public."Comment".id
GROUP BY 
	public."Comment".id, 
	public."Comment".content,
	public."Comment".created_at,
	public."User".id,
	public."User".fullname;
END; $$;


ALTER FUNCTION public.get_comments() OWNER TO postgres;

--
-- Name: get_feed_details(character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_feed_details(userid character varying, feedid integer) RETURNS TABLE(id integer, "originalPoster" jsonb, "group" jsonb, "shareFromFeed" jsonb, tags jsonb, content text, "voteState" boolean, upvote bigint, downvote bigint, share bigint, comment bigint, image character varying, "createdAt" timestamp without time zone, "commentList" jsonb)
    LANGUAGE plpgsql
    AS $$BEGIN
   RETURN QUERY SELECT 
	feed.*,
	jsonb_agg(comments.*) filter (WHERE comments.id IS NOT NULL) AS "commentList"
FROM 
	get_feeds_from_user(userid) as feed
LEFT JOIN get_comments() AS comments ON
	comments.feed_id = feedid
WHERE
	feed.id = feedid
GROUP BY
	feed.id,
	feed."originalPoster",
	feed."group",
	feed.content,
	feed."voteState",
	feed.upvote,
	feed.downvote,
	feed.share,
	feed.comment,
	feed.image,
	feed."createdAt",
	feed."shareFromFeed",
	feed.tags;
END; $$;


ALTER FUNCTION public.get_feed_details(userid character varying, feedid integer) OWNER TO postgres;

--
-- Name: get_feeds_from_user(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_feeds_from_user(userid character varying) RETURNS TABLE(id integer, "originalPoster" jsonb, "group" jsonb, "shareFromFeed" jsonb, tags jsonb, content text, "voteState" boolean, upvote bigint, downvote bigint, share bigint, comment bigint, image character varying, "createdAt" timestamp without time zone)
    LANGUAGE plpgsql
    AS $$BEGIN
   RETURN QUERY SELECT
             public."Feed".id
           , jsonb_build_object('id', public."User".id, 'fullname', public."User".fullname, 'avatar', public."User".avatar) AS "originalPoster"
           , jsonb_build_object('id', public."Group".id, 'name', public."Group".name, 'avatar', public."Group".avatar) AS "group"
		   , CASE feed2.id WHEN null THEN null
		   		           ELSE (
						   	SELECT jsonb_build_object(
								'id', feeds.id,
								'content', feeds.content,
								'group', jsonb_build_object('id', public."Group".id, 'name', public."Group".name, 'avatar', public."Group".avatar),
								'originalPoster', jsonb_build_object('id', public."User".id, 'fullname', public."User".fullname, 'avatar', public."User".avatar),
								'image', feeds.image,
								'createdAt', feeds.created_at,
								'tags', (SELECT jsonb_agg(name) FROM "Tag" WHERE "Tag".feed_ids @> Array[feeds.id])
							) 
							FROM "Feed" AS feeds
							LEFT JOIN
									public."User" 
									ON
									   public."User".id = feeds.original_poster_id
							LEFT JOIN
									public."Group"
									ON
									   public."Group".id = feeds.group_id
							WHERE feeds.id = feed2.id
						   )
			 END AS "shareFromFeed"
		   , (SELECT jsonb_agg(name) FROM "Tag" WHERE "Tag".feed_ids @> Array[public."Feed".id]) AS tags
           , public."Feed".content
           , (
                    SELECT
                           vote_state
                    FROM
                           public."FeedVote"
                    WHERE
                           public."FeedVote".feed_id = public."Feed".id
			   			   AND public."FeedVote".user_id = userid
             )
             AS "voteState"
           , (
                    SELECT
                           COUNT(public."FeedVote".user_id)
                    FROM
                           public."FeedVote"
                    WHERE
                           public."FeedVote".feed_id        = public."Feed".id
                           AND public."FeedVote".vote_state = true
             )
             AS upvote
           , (
                    SELECT
                           COUNT(public."FeedVote".user_id)
                    FROM
                           public."FeedVote"
                    WHERE
                           public."FeedVote".feed_id        = public."Feed".id
                           AND public."FeedVote".vote_state = false
             )
             AS downvote
           , (
                    SELECT
                           COUNT(feed3.id)
                    FROM
                           public."Feed" AS feed3
                    WHERE
                           feed3.share_from_feed_id = public."Feed".id
             )
             AS share
           , (
                    SELECT
                           comment.total + reply.total AS total
                    FROM
                           (
                                  SELECT
                                         COUNT(public."Comment".id) AS total
                                  FROM
                                         public."Comment"
                                  WHERE
                                         public."Comment".feed_id = public."Feed".id
                           )
                           AS comment
                         , (
                                      SELECT
                                                 COUNT(public."Reply".id) AS total
                                      FROM
                                                 public."Reply"
                                                 INNER JOIN
                                                            public."Comment"
                                                            ON
                                                                       public."Comment".id = public."Reply".comment_id
                                      WHERE
                                                 public."Comment".feed_id = public."Feed".id
                           )
                           AS reply
             )
             AS comment
           , public."Feed".image
           , public."Feed".created_at AS "createdAt"
  FROM
             public."Feed"
			 LEFT JOIN
			 			public."Feed" feed2
						ON
								   feed2.id = public."Feed".share_from_feed_id
             LEFT JOIN
                        public."User"
                        ON
                                   public."User".id = public."Feed".original_poster_id
			 LEFT JOIN
			 			public."Group"
						ON
								   public."Group".id = public."Feed".group_id;
END; $$;


ALTER FUNCTION public.get_feeds_from_user(userid character varying) OWNER TO postgres;

--
-- Name: get_group(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_group(group_id_input integer) RETURNS TABLE(id integer, avatar character varying, banner character varying, name character varying, intro character varying, description text, "memberList" jsonb, tags character varying[])
    LANGUAGE sql
    AS $$SELECT
	id,
	avatar,
	banner,
	name,
	intro,
	description,
	(SELECT
		jsonb_agg(users.*)
	FROM (
		SELECT
			id, fullname, avatar, role, position
		FROM "User"
		LEFT JOIN "Group_User" ON "Group_User".user_id = "User".id
		WHERE group_id = group_id_input
	) AS users)
	AS "memberList",
	(SELECT array(SELECT name FROM "Tag" WHERE "Tag".group_ids @> Array[id])) 
	AS tags
FROM "Group"
WHERE id = group_id_input
$$;


ALTER FUNCTION public.get_group(group_id_input integer) OWNER TO postgres;

--
-- Name: get_user_details(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_details(user_id_input character varying) RETURNS TABLE(id character varying, avatar character varying, fullname character varying, "position" character varying, "createdAt" date, "feedCount" bigint, "cmtCount" bigint)
    LANGUAGE sql
    AS $$
	SELECT 
		id, avatar, fullname, position, created_at AS "createdAt",
		(SELECT count("Feed".id) FROM "Feed" WHERE original_poster_id = "User".id)
		AS "feedCount",
		(
			SELECT
			(SELECT count("Comment".id) FROM "Comment" WHERE "Comment".user_id = "User".id) +
			(SELECT count("Comment".id) FROM "Comment" WHERE "Comment".user_id = "User".id)
		) AS "cmtCount"
	FROM "User"
	WHERE "User".id = user_id_input
$$;


ALTER FUNCTION public.get_user_details(user_id_input character varying) OWNER TO postgres;

--
-- Name: searching(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.searching(user_text_input character varying) RETURNS TABLE(data jsonb, type character varying, score real)
    LANGUAGE sql
    AS $$	SELECT
	jsonb_build_object(
		'id', id,
		'fullname', fullname,
		'avatar', avatar,
		'createdAt', created_at,
		'position', position
	) AS data,
	'user' AS type,
	ts_rank_cd(ts_tokens, plainto_tsquery('vietnamese', user_text_input)) AS score
	FROM "User"
	WHERE
		ts_rank_cd(ts_tokens, plainto_tsquery('vietnamese', user_text_input)) > 0
	UNION
	SELECT
		jsonb_build_object(
		'id', id,
		'name', name,
		'avatar', avatar,
		'tags', array(SELECT name FROM "Tag" WHERE "Tag".group_ids @> Array[id])
		) AS data,
		'group' AS type,
		ts_rank_cd(ts_tokens, plainto_tsquery('vietnamese', user_text_input)) AS score
	FROM "Group"
	WHERE
		ts_rank_cd(ts_tokens, plainto_tsquery('vietnamese', user_text_input)) > 0
	ORDER BY score DESC;
$$;


ALTER FUNCTION public.searching(user_text_input character varying) OWNER TO postgres;

--
-- Name: update_group(integer, character varying, character varying, character varying, character varying, character varying, character varying[]); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_group(id_input integer, avatar_input character varying, banner_input character varying, name_input character varying, intro_input character varying, description_input character varying, tags_input character varying[])
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE public."Group"
SET 
	avatar = avatar_input,
	banner = banner_input,
	name = name_input,
	intro = intro_input, 
	description = description_input
WHERE id = id_input;

DELETE FROM "Tag" WHERE group_ids @> Array[id_input];

FOR i IN 1..array_length(tags_input, 1) LOOP
	INSERT INTO public."Tag"(name, group_ids)
	VALUES (tags_input[i], ARRAY[id_input])
	ON CONFLICT (name)
	DO UPDATE
		SET group_ids = array_append(public."Tag".group_ids, id_input);
END LOOP;

COMMIT;
END;$$;


ALTER PROCEDURE public.update_group(id_input integer, avatar_input character varying, banner_input character varying, name_input character varying, intro_input character varying, description_input character varying, tags_input character varying[]) OWNER TO postgres;

--
-- Name: vietnamese_hunspell; Type: TEXT SEARCH DICTIONARY; Schema: public; Owner: postgres
--

CREATE TEXT SEARCH DICTIONARY public.vietnamese_hunspell (
    TEMPLATE = pg_catalog.ispell,
    dictfile = 'vi_vn', afffile = 'vi_vn', stopwords = 'vietnamese' );


ALTER TEXT SEARCH DICTIONARY public.vietnamese_hunspell OWNER TO postgres;

--
-- Name: vietnamese; Type: TEXT SEARCH CONFIGURATION; Schema: public; Owner: postgres
--

CREATE TEXT SEARCH CONFIGURATION public.vietnamese (
    PARSER = pg_catalog."default" );

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR asciiword WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR word WITH english_stem, public.vietnamese_hunspell;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR numword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR sfloat WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR numhword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR "int" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR uint WITH simple;


ALTER TEXT SEARCH CONFIGURATION public.vietnamese OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    feed_id integer NOT NULL,
    content text NOT NULL,
    user_id character varying(50) NOT NULL,
    created_at timestamp(4) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: CommentVote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CommentVote" (
    comment_id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    vote_state boolean
);


ALTER TABLE public."CommentVote" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Comment_id_seq" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Feed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Feed" (
    original_poster_id character varying(50) NOT NULL,
    content text NOT NULL,
    image character varying(200),
    created_at timestamp(4) without time zone NOT NULL,
    id integer NOT NULL,
    group_id integer,
    share_from_feed_id integer
);


ALTER TABLE public."Feed" OWNER TO postgres;

--
-- Name: FeedShare; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeedShare" (
    user_id character varying(50) NOT NULL,
    feed_id integer NOT NULL,
    content text
);


ALTER TABLE public."FeedShare" OWNER TO postgres;

--
-- Name: FeedVote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeedVote" (
    feed_id integer NOT NULL,
    user_id character varying NOT NULL,
    vote_state boolean
);


ALTER TABLE public."FeedVote" OWNER TO postgres;

--
-- Name: Feed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Feed_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Feed_id_seq" OWNER TO postgres;

--
-- Name: Feed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Feed_id_seq" OWNED BY public."Feed".id;


--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id integer NOT NULL,
    avatar character varying(100),
    banner character varying(100),
    intro character varying(200) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    ts_tokens tsvector
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: Group_User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group_User" (
    group_id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    role public."GroupRole"
);


ALTER TABLE public."Group_User" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Group_id_seq" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Group_id_seq" OWNED BY public."Group".id;


--
-- Name: Reply; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reply" (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    content text NOT NULL,
    user_id character varying(50) NOT NULL,
    created_at timestamp(4) without time zone NOT NULL
);


ALTER TABLE public."Reply" OWNER TO postgres;

--
-- Name: Reply_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reply_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Reply_id_seq" OWNER TO postgres;

--
-- Name: Reply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reply_id_seq" OWNED BY public."Reply".id;


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    name character varying(20) NOT NULL,
    group_ids integer[],
    feed_ids integer[]
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id character varying(50) NOT NULL,
    fullname character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    avatar character varying(200),
    created_at date NOT NULL,
    modified_at date NOT NULL,
    "position" character varying(50),
    ts_tokens tsvector,
    refresh_token character varying
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Feed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Feed" ALTER COLUMN id SET DEFAULT nextval('public."Feed_id_seq"'::regclass);


--
-- Name: Group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group" ALTER COLUMN id SET DEFAULT nextval('public."Group_id_seq"'::regclass);


--
-- Name: Reply id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reply" ALTER COLUMN id SET DEFAULT nextval('public."Reply_id_seq"'::regclass);


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, feed_id, content, user_id, created_at) FROM stdin;
22	4	asgagq	thanh22@gmail.com	2019-09-25 01:00:42.844
23	4	test	thanh22@gmail.com	2019-09-25 01:00:49.441
24	4	test	thanh22@gmail.com	2019-09-26 16:42:58.595
25	4	test 2	thanh22@gmail.com	2019-09-26 16:43:12.847
26	4	test 1	thanh22@gmail.com	2019-09-26 16:44:40.48
27	4	test 1	thanh22@gmail.com	2019-09-26 16:47:36.716
28	4	test asdga	thanh22@gmail.com	2019-09-26 16:47:51.937
31	5	test	thanh21@gmail.com	2019-09-29 17:15:00.565
32	5	test 2	thanh21@gmail.com	2019-09-29 17:15:06.219
\.


--
-- Data for Name: CommentVote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CommentVote" (comment_id, user_id, vote_state) FROM stdin;
\.


--
-- Data for Name: Feed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Feed" (original_poster_id, content, image, created_at, id, group_id, share_from_feed_id) FROM stdin;
thanh22@gmail.com	new feed test.. test testing testing	\N	2019-09-24 21:56:17.4447	4	47	\N
thanh22@gmail.com	test bài đăng số 001...\namdgklag...\nasfazvgfa	http://localhost:3000/files/feed/wvsVJk6k9TUwTTti6CLe5T.jpg	2019-09-24 23:12:39.532	5	46	\N
thanh22@gmail.com	đây là feed chia sẻ	\N	2019-09-26 03:16:49.267	7	46	4
thanh21@gmail.com	đây là feed chia sẻ 2..	\N	2019-09-26 04:32:52.684	8	47	5
thanh22@gmail.com	test feed bài mới	\N	2019-09-26 17:17:17.141	9	46	\N
thanh22@gmail.com	test	\N	2019-09-26 17:46:43.1	10	47	\N
thanh22@gmail.com	test 2	\N	2019-09-26 17:51:41.082	11	47	\N
thanh22@gmail.com	wqfqwfq	\N	2019-09-26 17:52:42.485	12	46	\N
thanh22@gmail.com	real-time update	\N	2019-09-26 17:53:18.912	13	46	\N
thanh22@gmail.com	test abna	\N	2019-09-26 17:55:42.567	14	47	\N
thanh22@gmail.com	test thứ 2	\N	2019-09-26 17:56:13.052	16	46	\N
thanh22@gmail.com	test 34	\N	2019-09-26 17:58:36.48	17	47	\N
thanh22@gmail.com	test	\N	2019-09-27 23:41:30.243	18	46	\N
thanh22@gmail.com	wqfqfqw	\N	2019-09-28 03:26:55.305	19	47	\N
thanh22@gmail.com	test agasga	\N	2019-09-28 03:28:11.996	20	47	\N
thanh22@gmail.com	test 15	\N	2019-09-30 00:12:00.979	21	47	\N
\.


--
-- Data for Name: FeedShare; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeedShare" (user_id, feed_id, content) FROM stdin;
\.


--
-- Data for Name: FeedVote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeedVote" (feed_id, user_id, vote_state) FROM stdin;
5	thanh22@gmail.com	\N
4	thanh22@gmail.com	\N
4	thanh21@gmail.com	\N
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, avatar, banner, intro, name, description, ts_tokens) FROM stdin;
46	\N	http://localhost:3000/files/group/v5japwDeStKmNEBR5rpL55.jpg	Đây là một cộng đồng thú vị bàn về C# và Microsoft. \nTest lại.	Cộng đồng hỗ trợ giúp đỡ các ứng dụng ASP.NET	Đây là cộng đồng giúp đỡ bạn xây dựng ứng dụng C# thế nào cho hợp lý.\nBàn luận về các design patterns.\nsau khi chỉnh lại	'asp.net':10 'bàn':17,39 'bạn':28 'c':19,33 'c/c++' 'cho':36 'các':7,42 'cộng':1,24 'design':43 'dụng':9,32 'dựng':30 'giúp':5,26 'hỗ':3 'hợp':37 'intro':11 'luận':40 'là':13,23 'lý':38 'microsoft':21 'một':14 'nào':35 'pattern':44 'thú':15 'thế':34 'trợ':4 'unreal' 'và':20 'về':18,41 'vị':16 'xâi':29 'đâi':12,22 'đồng':2,25 'đỡ':6,27 'ứng':8,31
47	http://localhost:3000/files/group/wvsVJk6k9TUwTTti6CLe5T.jpg	\N	Hỏi đáp về xây dựng game nói chung và Unreal framework nói riêng	Cộng đồng làm game Unreal framework	Bạn nên vào đây để được support tận răng.\nMọi thứ khó hiểu liên quan tới Blender, Maya, Unreal đều có thể hỏi ở đây.	'blender':36 'bạn':20 'chung':14 'có':40 'cộng':1 'dựng':11 'framework':6,17 'game':4,12 'hiểu':32 'hỏi':7,42 'java' 'khó':31 'liên':33 'làm':3 'maya':37 'mọi':29 'nên':21 'nói':13,18 'quan':34 'riêng':19 'răng':28 'spring' 'support':26 'thể':41 'thứ':30 'tận':27 'tới':35 'unreal':5,16,38 'và':15 'vào':22 'về':9 'xâi':10 'đáp':8 'đâi':23,44 'được':25 'đều':39 'để':24 'đồng':2 'ở':43
\.


--
-- Data for Name: Group_User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group_User" (group_id, user_id, role) FROM stdin;
46	thanh21@gmail.com	admin
46	thanh22@gmail.com	member
47	thanh22@gmail.com	member
47	thanh21@gmail.com	member
\.


--
-- Data for Name: Reply; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reply" (id, comment_id, content, user_id, created_at) FROM stdin;
9	22	test reply	thanh22@gmail.com	2019-09-26 14:37:52.008
10	27	reply test	thanh22@gmail.com	2019-09-26 16:51:18.36
11	27	reply test 3	thanh22@gmail.com	2019-09-26 17:11:47.782
12	27	reply test 4	thanh22@gmail.com	2019-09-26 17:12:32.521
13	27	reply test 5	thanh22@gmail.com	2019-09-26 17:12:43.981
14	27	reply test 6	thanh22@gmail.com	2019-09-26 17:13:37.623
15	27	asfgaga	thanh22@gmail.com	2019-09-26 17:13:57.19
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (name, group_ids, feed_ids) FROM stdin;
tag11	{27,28}	\N
tag22	{27,28}	\N
tag333	{27,28}	\N
xz	{29}	\N
zxz	{29}	\N
tag abs	{31,32,33}	\N
atag zz	{32,33}	\N
abc	{29,33}	\N
asdg	{35,36,37,38,39}	\N
asga	{36,37,38,39}	\N
zxva	{37,38,39}	\N
asfaf	{40}	\N
wqfqw	{42,43,44,45}	\N
zxcz	{43,44,45}	\N
zxvc	{43,44,45}	\N
asva	{43,44,45}	\N
c	\N	{4}
c++	\N	{5}
unity	\N	{5}
C#	{46}	\N
ASP.NET	{46}	\N
Microsoft	{46}	\N
spring	{47}	{8,10,11,14,17,19,20,21}
java	{47}	{4,8,10,11,14,17,19,20,21}
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, fullname, password, avatar, created_at, modified_at, "position", ts_tokens, refresh_token) FROM stdin;
thanh24@gmail.com	Hồ Quý Ly	$2b$10$xUiwGgjPnkUDBZb.wnt.oukedfTE9vPvmk.Ryft6.15WbFRSO5awa	\N	2019-09-29	2019-09-29	\N	\N	\N
thanh25@gmail.com	Lý Công Công	$2b$10$b6YysiyaOZ9jXaGn8NqiTu6ZnDkkW6VKJBC5kU5Ay1sP6zETtkFC2	\N	2019-09-29	2019-09-29	\N	\N	205d312a332a24cf577d17e59b3a85b24530d7d98e89ef80bc93cbfe8801b2c3
thanh23@gmail.com	Trương Hoàng Lý	$2b$10$xVpYECqLYRLyASTNnLr30u1nMgQdI/dpk04gbn2HDl.Xb9NJXgvK2	\N	2019-09-29	2019-09-29	\N	\N	eee6d7a2344cefe86d551056a41da7ee30ad8c44d4059dafdfa5c1b93c898d52
thanh21@gmail.com	Trương Trọng Thanh	$2b$10$SE9xLi1Dfn7cDsxqRCHKYO8bGMYe0YF3NCW1OfokS9qGv4pJOcYoS	\N	2019-09-08	2019-09-08	Intern Developer	'develop':5 'intern':4 'thanh':3 'trương':1 'trọng':2	dfaa5a5cbc2753697f610429b7198d19114aa6260b58420409598870290b0bbd
thanh22@gmail.com	Võ Hồng Gay	$2b$10$csTROne/ciw8AxK2EnwRH.ckP6c1pHRte.YW.tCsizxFEAbl/euXO	\N	2019-09-24	2019-09-24	Java Developer	'develop':5 'gay':3 'hồng':2 'java':4 'võ':1	8fdb1f689d702e5c8449245454c131450adf93d7390708ad4e778b61f6f5a7f5
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 32, true);


--
-- Name: Feed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Feed_id_seq"', 21, true);


--
-- Name: Group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Group_id_seq"', 47, true);


--
-- Name: Reply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reply_id_seq"', 15, true);


--
-- Name: CommentVote CommentVote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentVote"
    ADD CONSTRAINT "CommentVote_pkey" PRIMARY KEY (comment_id, user_id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: FeedShare FeedShare_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedShare"
    ADD CONSTRAINT "FeedShare_pkey" PRIMARY KEY (user_id, feed_id);


--
-- Name: Feed Feed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Feed"
    ADD CONSTRAINT "Feed_pkey" PRIMARY KEY (id);


--
-- Name: Group_User Group_User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group_User"
    ADD CONSTRAINT "Group_User_pkey" PRIMARY KEY (group_id, user_id);


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: Reply Reply_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reply"
    ADD CONSTRAINT "Reply_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (name);


--
-- Name: FeedVote User_Feed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedVote"
    ADD CONSTRAINT "User_Feed_pkey" PRIMARY KEY (feed_id, user_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

