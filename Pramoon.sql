PGDMP      *                |            Pramoon    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    77863    Pramoon    DATABASE     �   CREATE DATABASE "Pramoon" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.874';
    DROP DATABASE "Pramoon";
                postgres    false            �            1259    77906    bid    TABLE     �   CREATE TABLE public.bid (
    id integer NOT NULL,
    user_id integer NOT NULL,
    game_id integer NOT NULL,
    amount integer NOT NULL
);
    DROP TABLE public.bid;
       public         heap    postgres    false            �            1259    77905 
   bid_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 !   DROP SEQUENCE public.bid_id_seq;
       public          postgres    false    220                       0    0 
   bid_id_seq    SEQUENCE OWNED BY     9   ALTER SEQUENCE public.bid_id_seq OWNED BY public.bid.id;
          public          postgres    false    219            �            1259    77887    customer    TABLE     �   CREATE TABLE public.customer (
    user_id integer NOT NULL,
    username character varying(80) NOT NULL,
    password character varying(80) NOT NULL,
    money numeric(10,2) DEFAULT 0
);
    DROP TABLE public.customer;
       public         heap    postgres    false            �            1259    77886    customer_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.customer_user_id_seq;
       public          postgres    false    216                       0    0    customer_user_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.customer_user_id_seq OWNED BY public.customer.user_id;
          public          postgres    false    215            �            1259    77894    games    TABLE       CREATE TABLE public.games (
    game_id integer NOT NULL,
    title character varying(80) NOT NULL,
    description character varying(80) NOT NULL,
    start_price integer NOT NULL,
    end_date date NOT NULL,
    end_time time without time zone NOT NULL,
    owner integer NOT NULL
);
    DROP TABLE public.games;
       public         heap    postgres    false            �            1259    77893    games_game_id_seq    SEQUENCE     �   CREATE SEQUENCE public.games_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.games_game_id_seq;
       public          postgres    false    218                       0    0    games_game_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.games_game_id_seq OWNED BY public.games.game_id;
          public          postgres    false    217            ]           2604    77909    bid id    DEFAULT     `   ALTER TABLE ONLY public.bid ALTER COLUMN id SET DEFAULT nextval('public.bid_id_seq'::regclass);
 5   ALTER TABLE public.bid ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            Z           2604    77890    customer user_id    DEFAULT     t   ALTER TABLE ONLY public.customer ALTER COLUMN user_id SET DEFAULT nextval('public.customer_user_id_seq'::regclass);
 ?   ALTER TABLE public.customer ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    216    215    216            \           2604    77897    games game_id    DEFAULT     n   ALTER TABLE ONLY public.games ALTER COLUMN game_id SET DEFAULT nextval('public.games_game_id_seq'::regclass);
 <   ALTER TABLE public.games ALTER COLUMN game_id DROP DEFAULT;
       public          postgres    false    217    218    218            �          0    77906    bid 
   TABLE DATA           ;   COPY public.bid (id, user_id, game_id, amount) FROM stdin;
    public          postgres    false    220   *       �          0    77887    customer 
   TABLE DATA           F   COPY public.customer (user_id, username, password, money) FROM stdin;
    public          postgres    false    216   �       �          0    77894    games 
   TABLE DATA           d   COPY public.games (game_id, title, description, start_price, end_date, end_time, owner) FROM stdin;
    public          postgres    false    218   I                  0    0 
   bid_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.bid_id_seq', 36, true);
          public          postgres    false    219                       0    0    customer_user_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.customer_user_id_seq', 8, true);
          public          postgres    false    215                       0    0    games_game_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.games_game_id_seq', 18, true);
          public          postgres    false    217            c           2606    77911    bid bid_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.bid
    ADD CONSTRAINT bid_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.bid DROP CONSTRAINT bid_pkey;
       public            postgres    false    220            _           2606    77892    customer customer_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (user_id);
 @   ALTER TABLE ONLY public.customer DROP CONSTRAINT customer_pkey;
       public            postgres    false    216            a           2606    77899    games games_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);
 :   ALTER TABLE ONLY public.games DROP CONSTRAINT games_pkey;
       public            postgres    false    218            e           2606    77917    bid fk_game    FK CONSTRAINT     �   ALTER TABLE ONLY public.bid
    ADD CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;
 5   ALTER TABLE ONLY public.bid DROP CONSTRAINT fk_game;
       public          postgres    false    218    220    4705            d           2606    77900    games fk_owner    FK CONSTRAINT     �   ALTER TABLE ONLY public.games
    ADD CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES public.customer(user_id) ON DELETE CASCADE;
 8   ALTER TABLE ONLY public.games DROP CONSTRAINT fk_owner;
       public          postgres    false    216    218    4703            f           2606    77912    bid fk_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.bid
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.customer(user_id) ON DELETE CASCADE;
 5   ALTER TABLE ONLY public.bid DROP CONSTRAINT fk_user;
       public          postgres    false    220    216    4703            �   �   x�M��C!�V1d�_/鿎�'�vA ��B�AłF����~iN����)�X_Ŋ]l`+q�G({7P/�E�`�.	�efTF�Y�$:N���GO��C���fB[��xkW�_��}8݃��+��A��w�#���V�0�8LK:�J�K&�?���6d�F|? ~�_A=      �   U   x�3�LBC�30�2�,-N-2��qS������%��B�PI�,d%�$�8���!����1H���JZXH<F��� ��&�      �   !  x��RAn� <�W��T��@r��[�ڦ���]���*#��Z��r&�L�����m/�ȎH#Z�n��@�@�M�Lm��Y�ek�U���%ӂ~g��XS�;��\e�;�׾~��*�a�d;?t���72/w��yV�"q�����@�L'a9�B�N�*��I�9�CaD�I�d>K8���?%�{+7�U�`s���P�jlIc'�_D���Kp�5�[���}�T:6��5��M�b�tP�1�O��Y��W(�1��oK�z)ǧ�=������=��~U�     