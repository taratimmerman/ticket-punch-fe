import React, { useState, useRef } from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { ImBug } from "react-icons/im";
import { IoTicketOutline } from 'react-icons/io5';
import { MdError } from 'react-icons/md';
import { VscHistory } from 'react-icons/vsc';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openDeleteTicketModalAction, closeDeleteTicketModalAction, openEditTicketModalAction, closeEditTicketModalAction } from '../actions/modalActions';
import { getProjectByIdAction } from '../actions/projectActions';
import { deleteTicketAction, editTicketAction } from '../actions/ticketActions';
import { getUserId } from '../helpers/getUserInfo';
import {
    CardContainer,
    TitleWrapper,
    ContentWrapper,
    CardTitle,
    CardProject,
    CardDescription,
    CardStatus,
    CardButtonWrapper,
    CardButton,
    CardLabel
} from '../styling/CardStyling';
import {
    ModalContainer,
    ModalCircle,
    ModalButtonContainer,
    ModalAction,
    ModalItem
} from '../styling/ModalStyling';
import {
    SolidButton,
    OutlineButton,
    SolidInput,
    StyledForm,
    StyledLabel,
    SolidDropdown,
    SolidTextArea,
    InlineErrorWrapper,
    InlineErrorIcon,
    InlineError
} from '../styling/PageStyling';
import {
    SubActionContainer,
    SubAction
} from '../styling/WelcomeStyling';
import ErrorMessage from './ErrorMessage';

const TicketCard = props => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: "onBlur",
        defaultValues: {
            title: `${props.ticketTitle}`,
            description: `${props.ticketDescription}`,
            status: `${props.ticketStatus}`,
            projectTitle: `${props.projectTitle}`,
            bug: `${props.ticketBug}`,
            archived: `${props.ticketArchived}`
        }
    });

    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");

    const card = useRef(null);

    function toggleAccordion() {
        setActiveState(setActive === "" ? "active" : "");
        setHeightState(
            setActive === "active" ? "0px" : `${card.current.scrollHeight}px`
        );
        props.getProjectByIdAction(props.projectId);
    }

    const handleEditTicket = (ticketEdits) => {
        const id = props.ticketId;
        const user_id = getUserId();
        const project_id = parseInt(ticketEdits.projectTitle);
        const title = ticketEdits.title.trim();
        const description = ticketEdits.description.trim();
        const status = ticketEdits.status;
        const bug = ticketEdits.bug === "true" ? true : false;
        const archived = ticketEdits.archived === "true" ? true : false;

        console.log(id, user_id, project_id, title, description, status, bug, archived);
        console.log('Ticket title type: ', typeof title);
        console.log('Tickets object: ', ticketEdits);
        props.editTicketAction(id, user_id, project_id, title, description, status, bug, archived);
        reset();
    };

    const handleError = (errors) => console.log(errors);

    const editTicketValidation = {
        title: {
            required: "Please enter the ticket title",
            maxLength: {
                value: 30,
                message: "Ticket titles must be less than 30 characters"
            }
        },
        description: {
            required: "Please enter the ticket description",
            maxLength: {
                value: 140,
                message: "Ticket descriptions must be less than 140 characters"
            }
        }
    };

    return (
        <CardContainer>
            <TitleWrapper
                className={`${setActive}`}
                onClick={toggleAccordion}
            >
                <CardTitle>{props.title}</CardTitle>
                {props.bug ? <ImBug /> : null}
                {props.archived ? <VscHistory /> : null}
            </TitleWrapper>
            <ContentWrapper
                ref={card}
                style={{ maxHeight: `${setHeight}` }}
                className={`${setActive}`}
            >
                <CardLabel>Ticket ID</CardLabel>
                <CardProject>{props.id}</CardProject>

                <CardLabel>Project Title</CardLabel>
                <CardProject>{props.project.title}</CardProject>

                <CardLabel>Ticket Description</CardLabel>
                <CardDescription>{props.description}</CardDescription>

                <CardLabel>Ticket Status</CardLabel>
                <CardStatus>{props.status}</CardStatus>

                {props.archived ? null :
                    <CardButtonWrapper>
                        <CardButton onClick={() => props.openDeleteTicketModalAction()}>Delete</CardButton>
                        <CardButton onClick={() => props.openEditTicketModalAction()}>Edit</CardButton>
                    </CardButtonWrapper>}
            </ContentWrapper>

            {/* DELETE TICKET MODAL */}
            <ModalContainer
                className="red"
                isOpen={props.showDeleteModal} onRequestClose={() => props.closeDeleteTicketModalAction()}
                closeTimeoutMS={200}
                contentLabel="modal"
            >
                <ModalCircle className="red">
                    <BsTrash />
                </ModalCircle>
                <ModalAction>Delete <ModalItem className="red">{`${props.ticketTitle}`}</ModalItem> Ticket?</ModalAction>

                <ErrorMessage error={props.errorMessage} />

                <SubAction>This action cannot be undone</SubAction>

                <ModalButtonContainer>
                    <OutlineButton className="red restrict" onClick={() => props.closeDeleteTicketModalAction()}>Cancel</OutlineButton>
                    <SolidButton className="red restrict" onClick={() => props.deleteTicketAction(props.ticketId)}>Delete Ticket</SolidButton>
                </ModalButtonContainer>
            </ModalContainer>

            {/* EDIT TICKET MODAL */}
            <ModalContainer
                className="purple"
                isOpen={props.showEditModal}
                onRequestClose={() => props.closeEditTicketModalAction()}
                closeTimeoutMS={200}
                contentLabel="modal"
            >
                <ModalCircle className="purple">
                    <IoTicketOutline />
                </ModalCircle>
                <ModalAction>Edit <ModalItem className="purple">{`${props.ticketTitle}`}</ModalItem> Ticket</ModalAction>

                <ErrorMessage error={props.errorMessage} />

                <StyledForm onSubmit={handleSubmit(handleEditTicket, handleError)}>
                    <StyledLabel
                        htmlFor="title"
                    >Ticket Name</StyledLabel>

                    <SolidInput
                        type="text"
                        {...register('title', editTicketValidation.title)}
                        name="title"
                        placeholder={`${props.ticketTitle}`}
                    />
                    {errors.title ?
                        <InlineErrorWrapper>
                            <InlineErrorIcon>
                                <MdError />
                            </InlineErrorIcon>
                            <InlineError>{errors.title.message}</InlineError>
                        </InlineErrorWrapper>
                        : null}

                    <StyledLabel
                        htmlFor="description"
                    >Ticket Description</StyledLabel>

                    <SolidTextArea
                        type="text"
                        {...register('description', editTicketValidation.description)}
                        name="description"
                        placeholder={`${props.ticketDescription}`}
                    />
                    {errors.description ?
                        <InlineErrorWrapper>
                            <InlineErrorIcon>
                                <MdError />
                            </InlineErrorIcon>
                            <InlineError>{errors.description.message}</InlineError>
                        </InlineErrorWrapper>
                        : null}

                    <StyledLabel
                        htmlFor="projectTitle"
                    >Project Title</StyledLabel>

                    <SolidDropdown
                        name="projectTitle"
                        {...register('projectTitle')}
                    >
                        <option disabled selected>{props.projectTitle}</option>
                        {props.projects.map(project => (
                            <option key={project.id} value={project.id}>{project.title}</option>
                        ))}
                    </SolidDropdown>

                    <StyledLabel
                        htmlFor="status"
                    >Ticket Status</StyledLabel>

                    <SolidDropdown
                        name="status"
                        {...register('status')}
                    >
                        <option disabled selected>{props.ticketStatus}</option>
                        <option value="stuck">Stuck</option>
                        <option value="working_on_it">Working on it</option>
                        <option value="done">Done</option>
                        <option value="archived">Archive</option>
                    </SolidDropdown>

                    <StyledLabel
                        htmlFor="bug"
                    >Is this a bug ticket?</StyledLabel>

                    <SolidDropdown
                        name="bug"
                        {...register('bug')}
                    >
                        <option disabled selected>{props.ticketBug}</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </SolidDropdown>

                    <StyledLabel
                        htmlFor="archived"
                    >Would you like to archive this ticket?</StyledLabel>

                    <SolidDropdown
                        name="archived"
                        {...register('archived')}
                    >
                        <option disabled selected>{props.ticketArchived}</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </SolidDropdown>

                    <SubActionContainer>
                        <SubAction>These changes cannot be undone</SubAction>
                    </SubActionContainer>

                    <ModalButtonContainer>
                        <SolidButton
                            type="submit"
                            className="purple restrict"
                        >Edit Ticket</SolidButton>
                    </ModalButtonContainer>

                </StyledForm>

                <ModalButtonContainer>
                    <OutlineButton
                        className="purple restrict"
                        onClick={() => props.closeEditTicketModalAction()}
                    >Cancel</OutlineButton>
                </ModalButtonContainer>
            </ModalContainer>

        </CardContainer>
    );
};

TicketCard.propTypes = {
    title: PropTypes.string,
    bug: PropTypes.bool,
    archived: PropTypes.bool,
    description: PropTypes.string,
    status: PropTypes.string,
    id: PropTypes.number,
    ticketId: PropTypes.number,
    ticketTitle: PropTypes.string,
    ticketDescription: PropTypes.string,
    ticketStatus: PropTypes.string,
    projectTitle: PropTypes.number,
    ticketBug: PropTypes.bool,
    ticketArchived: PropTypes.bool,
    getProjectByIdAction: PropTypes.func,
    projectId: PropTypes.number,
    ticket: PropTypes.object,
    project: PropTypes.object,
    projects: PropTypes.array,
    deleteTicketAction: PropTypes.func,
    openDeleteTicketModalAction: PropTypes.func,
    closeDeleteTicketModalAction: PropTypes.func,
    showDeleteModal: PropTypes.bool,
    editTicketAction: PropTypes.func,
    openEditTicketModalAction: PropTypes.func,
    closeEditTicketModalAction: PropTypes.func,
    showEditModal: PropTypes.bool,
    errorMessage: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        project: state.projectReducer.project,
        projects: state.projectReducer.projects,
        ticketId: state.ticketReducer.ticketId,
        ticketTitle: state.ticketReducer.ticketTitle,
        ticketDescription: state.ticketReducer.ticketDescription,
        ticketStatus: state.ticketReducer.ticketStatus,
        projectTitle: state.ticketReducer.projectTitle,
        ticketBug: state.ticketReducer.ticketBug,
        ticketArchived: state.ticketReducer.ticketArchived,
        showDeleteModal: state.modalReducer.showDeleteTicketModal,
        showEditModal: state.modalReducer.showEditTicketModal,
        errorMessage: state.ticketReducer.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getProjectByIdAction: getProjectByIdAction,
        deleteTicketAction: deleteTicketAction,
        openDeleteTicketModalAction: openDeleteTicketModalAction,
        closeDeleteTicketModalAction: closeDeleteTicketModalAction,
        editTicketAction: editTicketAction,
        openEditTicketModalAction: openEditTicketModalAction,
        closeEditTicketModalAction: closeEditTicketModalAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketCard);