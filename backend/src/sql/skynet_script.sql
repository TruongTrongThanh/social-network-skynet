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
INSERT INTO public."Group"(avatar, name, intro, description, ts_tokens)
VALUES (avatar, group_name, intro, description,
	   	to_tsvector(group_name) || 
		to_tsvector(intro) || 
		to_tsvector(description) ||
		array_to_tsvector(tags)
	   )
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
	description = description_input,
	ts_tokens = 
		to_tsvector(name_input) || 
		to_tsvector(intro_input) || 
		to_tsvector(description_input) ||
		array_to_tsvector(tags_input)
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
    intro character varying(1000) NOT NULL,
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
    refresh_token character varying,
    email character varying(100),
    activate_token character varying(200),
    is_activated boolean NOT NULL,
    pass_token character varying(200)
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

