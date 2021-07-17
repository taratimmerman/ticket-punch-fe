import React from 'react';
import Card from '../components/Card';
import {
    PageContainer,
    PageTitleWrapper,
    PageTitle,
    SolidButton,
    KanbanContainer,
    Bar,
    StatusTitle,
    CardContainer
} from '../styling/PageStyling';

const Tickets = () => {
    return (
        <PageContainer className="page">
            <PageTitleWrapper>
                <PageTitle>Tickets</PageTitle>
                <SolidButton className="purple">New Ticket</SolidButton>
            </PageTitleWrapper>
            <KanbanContainer>
                <Bar className="stuck">
                    <StatusTitle>Stuck</StatusTitle>
                    <CardContainer>
                        <Card bug={true} cardTitle={"Deploy to Heroku"} />
                    </CardContainer>
                </Bar>
                <Bar className="working-on-it">
                    <StatusTitle>Working on it</StatusTitle>
                    <CardContainer>
                        <Card cardTitle={"Create GitHub repo"} />
                        <Card cardTitle={"Build and style login flow"} />
                        <Card cardTitle={"Build and style navbar"} />
                    </CardContainer>
                </Bar>
                <Bar className="done">
                    <StatusTitle>Done</StatusTitle>
                    <CardContainer>
                        <Card cardTitle={"Design site wireframes"} />
                        <Card cardTitle={"Research app idea"} />
                    </CardContainer>
                </Bar>
            </KanbanContainer>
        </PageContainer>
    );
};

export default Tickets;