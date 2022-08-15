--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Ubuntu 14.4-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hashtagPosts; Type: TABLE; Schema: public; Owner: prvopyysdkemwy
--

CREATE TABLE "public"."hashtagPosts" (
    "id" integer NOT NULL,
    "postId" integer NOT NULL,
    "hashtagId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE public."hashtagPosts" OWNER TO postgres;

--
-- Name: hashtagPosts_id_seq; Type: SEQUENCE; Schema: public; Owner: prvopyysdkemwy
--

CREATE SEQUENCE "public"."hashtagPosts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."hashtagPosts_id_seq" OWNER TO postgres;

--
-- Name: hashtagPosts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prvopyysdkemwy
--

ALTER SEQUENCE "public"."hashtagPosts_id_seq" OWNED BY "public"."hashtagPosts"."id";


--
-- Name: hashtags; Type: TABLE; Schema: public; Owner: prvopyysdkemwy
--

CREATE TABLE "public"."hashtags" (
    "id" integer NOT NULL,
    "text" "text" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE public.hashtags OWNER TO postgres;

--
-- Name: hashtags_id_seq; Type: SEQUENCE; Schema: public; Owner: prvopyysdkemwy
--

CREATE SEQUENCE "public"."hashtags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hashtags_id_seq OWNER TO postgres;

--
-- Name: hashtags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prvopyysdkemwy
--

ALTER SEQUENCE "public"."hashtags_id_seq" OWNED BY "public"."hashtags"."id";


--
-- Name: likes; Type: TABLE; Schema: public; Owner: prvopyysdkemwy
--

CREATE TABLE "public"."likes" (
    "id" integer NOT NULL,
    "postId" integer NOT NULL,
    "userLikedId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: prvopyysdkemwy
--

CREATE SEQUENCE "public"."likes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_id_seq OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prvopyysdkemwy
--

ALTER SEQUENCE "public"."likes_id_seq" OWNED BY "public"."likes"."id";


--
-- Name: posts; Type: TABLE; Schema: public; Owner: prvopyysdkemwy
--

CREATE TABLE "public"."posts" (
    "id" integer NOT NULL,
    "urlTitle" "text" NOT NULL,
    "comment" "text" NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "urlImage" "text" NOT NULL,
    "urlDescription" "text" NOT NULL,
    "urlLink" "text" NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: prvopyysdkemwy
--

CREATE SEQUENCE "public"."posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prvopyysdkemwy
--

ALTER SEQUENCE "public"."posts_id_seq" OWNED BY "public"."posts"."id";


--
-- Name: users; Type: TABLE; Schema: public; Owner: prvopyysdkemwy
--

CREATE TABLE "public"."users" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "password" "text" NOT NULL,
    "profilePic" "text" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: prvopyysdkemwy
--

CREATE SEQUENCE "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prvopyysdkemwy
--

ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";


--
-- Name: hashtagPosts id; Type: DEFAULT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtagPosts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hashtagPosts_id_seq"'::"regclass");


--
-- Name: hashtags id; Type: DEFAULT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtags" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hashtags_id_seq"'::"regclass");


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."likes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."likes_id_seq"'::"regclass");


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."posts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."posts_id_seq"'::"regclass");


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");


--
-- Data for Name: hashtagPosts; Type: TABLE DATA; Schema: public; Owner: prvopyysdkemwy
--



--
-- Name: hashtagPosts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prvopyysdkemwy
--

SELECT pg_catalog.setval('"public"."hashtagPosts_id_seq"', 28, true);


--
-- Name: hashtags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prvopyysdkemwy
--

SELECT pg_catalog.setval('"public"."hashtags_id_seq"', 19, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prvopyysdkemwy
--

SELECT pg_catalog.setval('"public"."likes_id_seq"', 2, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prvopyysdkemwy
--

SELECT pg_catalog.setval('"public"."posts_id_seq"', 23, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prvopyysdkemwy
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 49, true);


--
-- Name: hashtagPosts hashtagPosts_pkey; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtagPosts"
    ADD CONSTRAINT "hashtagPosts_pkey" PRIMARY KEY ("id");


--
-- Name: hashtags hashtags_pkey; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtags"
    ADD CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id");


--
-- Name: hashtags hashtags_text_key; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtags"
    ADD CONSTRAINT "hashtags_text_key" UNIQUE ("text");


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: hashtagPosts hashtagPosts_hashtagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtagPosts"
    ADD CONSTRAINT "hashtagPosts_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "public"."hashtags"("id");


--
-- Name: hashtagPosts hashtagPosts_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."hashtagPosts"
    ADD CONSTRAINT "hashtagPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id");


--
-- Name: likes likes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id");


--
-- Name: likes likes_userLikedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_userLikedId_fkey" FOREIGN KEY ("userLikedId") REFERENCES "public"."users"("id");


--
-- Name: posts posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prvopyysdkemwy
--

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id");


--
-- PostgreSQL database dump complete
--

