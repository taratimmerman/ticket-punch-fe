import React from 'react';

import PropTypes from 'prop-types';
import { GiBoxingGlove } from 'react-icons/gi';
import { IoTicketOutline, IoHelpCircleOutline } from 'react-icons/io5';
import { VscHistory, VscAccount } from 'react-icons/vsc';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { openHelpModalAction } from '../actions/modalActions';
import HelpModal from './modals/HelpModal';

const Navbar = ({ openHelpModalAction, showHelpModal}) => {

    return (
        <NavContainer>

            <NavChunk>
                <StyledNavLink to="/projects">
                    <GiBoxingGlove />
                    <LinkTitle>Projects</LinkTitle>
                </StyledNavLink>

                <StyledNavLink to="/tickets">
                    <IoTicketOutline />
                    <LinkTitle>Tickets</LinkTitle>
                </StyledNavLink>

                <StyledNavLink to="/history">
                    <VscHistory />
                    <LinkTitle>History</LinkTitle>
                </StyledNavLink>
            </NavChunk>

            <NavChunk>
                <HelpIcon onClick={() => openHelpModalAction()}>
                    <IoHelpCircleOutline />
                    <LinkTitle>Help</LinkTitle>
                </HelpIcon>

                {showHelpModal ? <HelpModal /> : null}

                <StyledNavLink to="/profile">
                    <VscAccount />
                    <LinkTitle>Profile</LinkTitle>
                </StyledNavLink>
            </NavChunk>

        </NavContainer>
    );
};

Navbar.propTypes = {
    openHelpModalAction: PropTypes.func,
    showHelpModal: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        showHelpModal: state.modalReducer.showHelpModal
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        openHelpModalAction: openHelpModalAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

// STYLED COMPONENTS BELOW:

const NavContainer = styled.nav`
    margin: 0;
    padding: 0;
    width: 60px;
    height: 100vh;
    float: left;
    background-color: #303134;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: #551a8b;
    overflow: hidden;
    position: fixed;

    @media screen and (max-width: 540px) {
        width: 100vw;
        height: 60px;
        bottom: 0;
        flex-direction: row;
        position: fixed;
    }

    @media screen and (max-width: 320px) {
        height: 50px;
    }
`;

const NavChunk = styled.div`
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-evenly;
    width: 100%;
    height: 250px;

    @media screen and (max-width: 540px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        max-width: 50%;
        height: 100%;
    }
`;

const StyledNavLink = styled(NavLink)`
    font-size: 1.6rem;
    text-decoration: none;
    color: #9AA0A6;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    transition: 0.3s ease;

    &.active{
        color: #A25DDC;
        background-color: #202124;
    }

    @media screen and (min-width: 720px) {
        :hover {
            background-color: #202124;
        }
    }

    @media screen and (max-width: 320px) {
        font-size: 1.3rem;
    }
`;

const LinkTitle = styled.h5`
    font-size: 0.75rem;
    font-weight: 400;
    padding-top: 3px;
`;

const HelpIcon = styled.div`
    font-size: 1.8rem;
    text-decoration: none;
    color: #9AA0A6;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    transition: 0.3s ease;

    @media screen and (min-width: 720px) {
        :hover {
            background-color: #202124;
        }
    }

    @media screen and (max-width: 500px) {
        font-size: 1.5rem;
    }

    @media screen and (max-width: 320px) {
        font-size: 1.3rem;
    }

    :hover{
        cursor: pointer;
    }
`;