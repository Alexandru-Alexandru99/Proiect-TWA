import React, { useState } from "react";

import styled from "styled-components";
import { NavLink } from "react-router-dom";

import Events from "../images/event.png";
import Profile from "../images/profile.png"
import Home from "../images/home.png"
import Refund from "../images/refund.png"
import Shop from "../images/shop.png"
import Transaction from "../images/transaction.png"
import User from "../images/user.png"
import logo from "../images/favicon.ico";

const Container = styled.div`
  position: fixed;
  .active {
    border-right: 2px solid orange;
  }
`;

const Button = styled.button`
  background-color: #22272e;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid #30363d;
  &::before,
  &::after {
    content: "";
    background-color: white;
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }
  &::before {
    top: ${(props) => (props.clicked ? "1.5" : "1rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }
  &::after {
    top: ${(props) => (props.clicked ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const SidebarContainer = styled.div`
  background-color: #22272e;
  width: 5.5rem;
  height: 85vh;
  margin-top: 50px;
  margin-bottom: 10px;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border: 1px solid #30363d;
`;

const Logo = styled.div`
  width: 2rem;
  img {
    width: 100%;
    height: auto;
  }
`;

const SlickBar = styled.ul`
  color: white;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #22272e;
  padding: 2rem 0;
  position: absolute;
  top: 8rem;
  left: 0;
  width: ${(props) => (props.clicked ? "11rem" : "5.5rem")};
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
  border: 1px solid #30363d;
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: white;
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;
  display: flex;
  padding-left: 1rem;
  &:hover {
    border-right: 2px solid orange;
    img {
      // filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
      //   brightness(103%) contrast(103%);
    }
  }
  img {
    width: 2.5rem;
    height: auto;
    // filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg)
    //   brightness(78%) contrast(85%);
  }
`;

const Text = styled.span`
  width: ${(props) => (props.clicked ? "100%" : "0")};
  overflow: hidden;
  margin-left: ${(props) => (props.clicked ? "1.5rem" : "0")};
  transition: all 0.3s ease;
`;

const Sidebar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  return (
    <Container>
      <Button clicked={click} onClick={() => handleClick()}>
      </Button>
      <SidebarContainer>
        <Logo>
          <img src={logo} alt="logo" />
        </Logo>
        <SlickBar clicked={click}>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/profile"
          >
            <img src={Profile} alt="Profile" />
            <Text clicked={click}>Your tickets</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            exact
            activeClassName="active"
            to="/"
          >
            <img src={Home} alt="Home" />
            <Text clicked={click}>Home</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/shop"
          >
            <img src={Shop} alt="Shop" />
            <Text clicked={click}>Buy tickets</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/refunds"
          >
            <img src={Refund} alt="Refund" />
            <Text clicked={click}>See refunds</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/adminusers"
          >
            <img src={User} alt="User" />
            <Text clicked={click}>Users</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/transactions"
          >
            <img src={Transaction} alt="Transactions" />
            <Text clicked={click}>Transactions</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/manageevents"
          >
            <img src={Events} alt="Events" />
            <Text clicked={click}>Manage events</Text>
          </Item>
        </SlickBar>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;