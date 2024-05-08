import "./index.css";

const ProfilePage = ({currentUser}) => {
        
    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>User Profile</h2>
            </div>
            <div className="profile-info">
            {currentUser ? (
                <div>
                    <p id="showFirstNameInput">First Name: {currentUser.firstName}</p>
                    <p id="showLastNameInput">Last Name: {currentUser.lastName}</p>
                    <p id="showUsernameInput">Username: {currentUser.username}</p>
                    <p id="showEmailInput">Email: {currentUser.email}</p>
                    <p id="showUserRole">Role: {currentUser.role}</p>
              </div>
            ) : (
                <p className="loading-message"> Please register or login to view the profile. </p>
            )}
            </div>
        </div>
    );
};

export default ProfilePage;
