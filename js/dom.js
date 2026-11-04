// navbar

export let hamburger;
export let navMenu;
export let nav;
export let logo;
export let navItems;
export let navBorder;

// index

export let headingIndex;
export let textIntro;
export let bell;
export let specialties;
export let codeWord;

// work

export let header;
export let textArea;
export let cardArea;
export let cardImg;
export let cardText;
export let cardLinks;
export let secondaryLink;
export let primaryLink;
export let resumeBtn;

// experience

export let container;
export let section;
export let skillsInfo;
export let jobTitle;
export let jobInfo;
export let headerHr;
export let headerXp;
export let headerOneXp;
export let headerTwoXp;
export let headerThreeXp;

// case studies

export let textPicContainer;
export let textContainer;
export let titleContainer;
export let infoSection;
export let subHeader;
export let list;
export let persona;
export let personaImg;
export let picContainer;
export let colorCircle;
export let colorText;
export let colorContainer;
export let nativeIconContainer;
export let illustrationIcons;
export let screenImg;
export let androidScreenImg;
export let finalPhone;

// about me

export let profilePic;
export let profileTextContainer;
export let linkGroup;
export let iconGroup;
export let hrLine;
export let contactTitle;
export let iconLink;

// footer

export let footer;

export function refreshDomReferences() {
    hamburger = document.querySelector(".hamburger");
    navMenu = document.querySelector(".nav-menu");
    nav = document.querySelector("nav");
    logo = document.querySelector(".logo");
    navItems = document.querySelectorAll(".nav_item");
    navBorder = document.querySelector(".nav_border");

    headingIndex = document.querySelector(".heading_index");
    textIntro = document.querySelector(".text_intro");
    bell = document.querySelector(".bell_gif_img");
    specialties = document.querySelector(".specialties");
    codeWord = document.querySelectorAll(".code_word");

    header = document.querySelector(".header");
    textArea = document.querySelector(".text_area");
    cardArea = document.querySelectorAll(".card_area");
    cardImg = document.querySelectorAll(".card_img");
    cardText = document.querySelectorAll(".card_txt");
    cardLinks = document.querySelectorAll(".card-links");
    secondaryLink = document.querySelectorAll(".secondary-link");
    primaryLink = document.querySelectorAll(".primary-link");
    resumeBtn = document.querySelector(".resume-btn");

    container = document.querySelectorAll(".container");
    section = document.querySelectorAll("section");
    skillsInfo = document.querySelectorAll(".skills_info");
    jobTitle = document.querySelectorAll(".job_title");
    jobInfo = document.querySelectorAll(".job_info");
    headerHr = document.querySelectorAll(".header_hr");
    headerXp = document.querySelector("header");
    headerOneXp = document.querySelector(".header_h1_xp");
    headerTwoXp = document.querySelector(".header_h2_xp");
    headerThreeXp = document.querySelectorAll("h3");

    textPicContainer = document.querySelector(".text_pic_container");
    textContainer = document.querySelector(".text_container");
    titleContainer = document.querySelector(".title_container");
    infoSection = document.querySelector(".info_section");
    subHeader = document.querySelector(".sub_header");
    list = document.querySelector(".list");
    persona = document.querySelector(".group_persona");
    personaImg = document.querySelector(".persona_img");
    picContainer = document.querySelector(".pic_container");
    colorCircle = document.querySelector(".color_circle");
    colorText = document.querySelector(".color_text");
    colorContainer = document.querySelector(".color_container");
    nativeIconContainer = document.querySelector(".native_icon_container");
    illustrationIcons = document.querySelector(".fit_icons");
    screenImg = document.querySelector(".screen_img");
    androidScreenImg = document.querySelector(".android_screen_img");
    finalPhone = document.querySelector(".final_phone");

    profilePic = document.querySelector(".profile_picture");
    profileTextContainer = document.querySelectorAll(
        ".profile_text_container",
    );
    linkGroup = document.querySelector(".link_group");
    iconGroup = document.querySelector(".icon_group");
    hrLine = document.querySelector(".contact_section hr");
    contactTitle = document.querySelector(".footer_text");
    iconLink = document.querySelectorAll(".icon_link");

    footer = document.querySelector(".footer_credit");
}

refreshDomReferences();
