import React from 'react'
import { Button, Navbar } from 'react-bootstrap';
import { User } from '../models/user';
import * as UserApi from '../network/users_api';

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessfully: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessfully }: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await UserApi.logout();
            onLogoutSuccessfully();
        } catch (error) {
            console.error(error);
            alert(error)
        }
    }
    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Logout</Button>
        </>
    )
}

export default NavBarLoggedInView;