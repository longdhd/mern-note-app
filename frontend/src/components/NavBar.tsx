import { Container, Nav, Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"
import { User } from "../models/user"
import NavBarLoggedInView from "./NavBarLoggedInView"
import NavBarLoggedOutView from "./NavBarLoggedOutView"

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessfully: () => void,
}

const NavBar = ({ loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessfully }: NavBarProps) => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    MERN Note App
                </Navbar.Brand>
                <Navbar.Toggle arial-aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link} to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser
                            ? <NavBarLoggedInView 
                                user={loggedInUser} 
                                onLogoutSuccessfully={onLogoutSuccessfully}
                            />
                            : <NavBarLoggedOutView
                                onSignUpClicked={onSignUpClicked}
                                onLoginClicked={onLoginClicked}
                            />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar