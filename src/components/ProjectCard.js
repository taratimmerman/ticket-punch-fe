import React, { useState, useRef } from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { GiBoxingGlove } from 'react-icons/gi';
import { MdError } from 'react-icons/md';
import { VscHistory } from 'react-icons/vsc';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openDeleteProjectModalAction, closeDeleteProjectModalAction } from '../actions/modalActions';
import { deleteProjectAction, editProjectAction } from '../actions/projectActions';
import { activeUserId } from '../helpers/getUserId';
import {
    CardContainer,
    TitleWrapper,
    ContentWrapper,
    CardTitle,
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
    ModalDetails,
    ModalItem
} from '../styling/ModalStyling';
import {
    SolidInput,
    StyledForm,
    StyledLabel,
    SolidDropdown,
    SolidTextArea,
    OutlineButton,
    SolidButton,
    InlineErrorWrapper,
    InlineErrorIcon,
    InlineError
} from '../styling/PageStyling';
import {
    SubActionContainer,
    SubAction
} from '../styling/WelcomeStyling';

const ProjectCard = (props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: "onBlur",
        defaultValues: {
            title: `${props.projectTitle}`,
            description: `${props.projectDescription}`,
            status: `${props.projectStatus}`
        }
    });

    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");
    const [setEditProjectIsOpen, setEditProjectIsOpenState] = useState(false);

    const card = useRef(null);

    function toggleAccordion() {
        setActiveState(setActive === "" ? "active" : "");
        setHeightState(
            setActive === "active" ? "0px" : `${card.current.scrollHeight}px`
        );
    }

    const handleEditProject = (projectEdits) => {
        const projectId = props.projectId;
        const user_id = activeUserId;
        const title = projectEdits.title.trim();
        const description = projectEdits.description.trim();
        const status = projectEdits.status.trim();
        console.log(projectEdits);

        editProjectAction(projectId, user_id, title, description, status);
        reset();
    };

    const handleError = (errors) => console.log(errors);

    const editProjectValidation = {
        title: {
            required: "Please enter the project title"
        },
        description: {
            required: "Please enter the project description"
        }
    };

    return (
        <CardContainer>
            <TitleWrapper
                className={`${setActive}`}
                onClick={toggleAccordion}
            >
                <CardTitle>{props.title}</CardTitle>
                {props.archived ? <VscHistory /> : null}
            </TitleWrapper>
            <ContentWrapper
                ref={card}
                style={{ maxHeight: `${setHeight}` }}
                className={`${setActive}`}
            >
                <CardLabel>Project ID</CardLabel>
                <CardDescription>{props.id}</CardDescription>

                <CardLabel>Project Description</CardLabel>
                <CardDescription>{props.description}</CardDescription>

                <CardLabel>Project Status</CardLabel>
                <CardStatus>{props.status}</CardStatus>

                {props.archived ? null :
                    <CardButtonWrapper>
                        <CardButton onClick={() => props.openDeleteProjectModalAction()}>Delete</CardButton>
                        <CardButton onClick={() => setEditProjectIsOpenState(true)}>Edit</CardButton>
                    </CardButtonWrapper>}
            </ContentWrapper>

            {/* DELETE PROJECT MODAL */}
            <ModalContainer
                className="red"
                isOpen={props.showDeleteModal} onRequestClose={() => props.closeDeleteProjectModalAction()}
                closeTimeoutMS={200}
                contentLabel="modal"
            >
                <ModalCircle className="red">
                    <BsTrash />
                </ModalCircle>
                <ModalAction>Delete<ModalItem className="red">{`${props.projectTitle}`}</ModalItem>Project?</ModalAction>

                <ModalDetails>Related tickets will also be deleted</ModalDetails>

                <SubAction>This action cannot be undone</SubAction>

                <ModalButtonContainer>
                    <OutlineButton className="red restrict" onClick={() => props.closeDeleteProjectModalAction()}>Cancel</OutlineButton>
                    <SolidButton className="red restrict" onClick={() => props.deleteProjectAction(props.projectId)}>Delete Project</SolidButton>
                </ModalButtonContainer>
            </ModalContainer>

            {/* EDIT PROJECT MODAL */}
            <ModalContainer
                className="purple"
                isOpen={setEditProjectIsOpen}
                onRequestClose={() => setEditProjectIsOpenState(false)}
                closeTimeoutMS={200}
                contentLabel="modal"
            >
                <ModalCircle className="purple">
                    <GiBoxingGlove />
                </ModalCircle>

                <ModalAction>Edit <ModalItem className="purple">{`${props.projectTitle}`}</ModalItem> Project</ModalAction>
                <StyledForm onSubmit={handleSubmit(handleEditProject, handleError)}>
                    <StyledLabel
                        htmlFor="title"
                    >Project Title</StyledLabel>

                    <SolidInput
                        type="text"
                        {...register('title', editProjectValidation.title)}
                        name="title"
                        placeholder={`${props.projectTitle}`}
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
                    >Project Description</StyledLabel>

                    <SolidTextArea
                        type="text"
                        {...register('description', editProjectValidation.description)}
                        name="description"
                        placeholder={`${props.projectDescription}`}
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
                        htmlFor="status"
                    >Project Status</StyledLabel>

                    <SolidDropdown
                        name="status"
                        {...register('status')}
                    >
                        <option>---</option>
                        <option value="working_on_it">Working on it</option>
                        <option value="done">Done</option>
                    </SolidDropdown>
                    <SubActionContainer>
                        <SubAction>These changes cannot be undone</SubAction>
                    </SubActionContainer>
                    <ModalButtonContainer>
                        <OutlineButton
                            className="purple restrict"
                            onClick={() => setEditProjectIsOpenState(false)}
                        >Cancel</OutlineButton>

                        <SolidButton
                            type="submit"
                            className="purple restrict"
                        >Edit Project</SolidButton>
                    </ModalButtonContainer>
                </StyledForm>
            </ModalContainer>

        </CardContainer>
    );
};

ProjectCard.propTypes = {
    title: PropTypes.string,
    bug: PropTypes.bool,
    archived: PropTypes.bool,
    description: PropTypes.string,
    project: PropTypes.string,
    status: PropTypes.string,
    id: PropTypes.number,
    projectId: PropTypes.number,
    projectTitle: PropTypes.string,
    projectDescription: PropTypes.string,
    projectStatus: PropTypes.string,
    deleteProjectAction: PropTypes.func,
    openDeleteProjectModalAction: PropTypes.func,
    closeDeleteProjectModalAction: PropTypes.func,
    showDeleteModal: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        projectId: state.projectReducer.projectId,
        projectTitle: state.projectReducer.projectTitle,
        projectDescription: state.projectReducer.projectDescription,
        projectStatus: state.projectReducer.projectStatus,
        showDeleteModal: state.modalsReducer.showDeleteProjectModal
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        deleteProjectAction: deleteProjectAction,
        openDeleteProjectModalAction: openDeleteProjectModalAction,
        closeDeleteProjectModalAction: closeDeleteProjectModalAction,
        editProjectAction: editProjectAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);
