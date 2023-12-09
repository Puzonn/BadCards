﻿// <auto-generated />
using BadCards.Api.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BadCards.Api.Migrations
{
    [DbContext(typeof(BadCardsContext))]
    [Migration("20231008104612_LangPref")]
    partial class LangPref
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.11");

            modelBuilder.Entity("BadCards.Api.Models.Database.CardDb", b =>
                {
                    b.Property<uint>("CardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsBlack")
                        .HasColumnType("INTEGER");

                    b.HasKey("CardId");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("BadCards.Api.Models.Database.CardTranslationDb", b =>
                {
                    b.Property<uint>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<uint>("CardId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Locale")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Translation")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("CardTranslations");
                });

            modelBuilder.Entity("BadCards.Api.Models.Database.RoomDb", b =>
                {
                    b.Property<uint>("RoomId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("GameStarted")
                        .HasColumnType("INTEGER");

                    b.Property<string>("LobbyCode")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("PlayersCount")
                        .HasColumnType("INTEGER");

                    b.HasKey("RoomId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("BadCards.Api.Models.Database.UserDb", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AvatarId")
                        .HasColumnType("TEXT");

                    b.Property<ulong>("DiscordId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("LanguagePreference")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
