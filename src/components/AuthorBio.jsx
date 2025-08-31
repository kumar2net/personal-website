const AuthorBio = ({ author, bio, avatar = null }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 mb-8">
      <div className="flex items-center space-x-4">
        {avatar && (
          <div className="flex-shrink-0">
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{author}</h3>
          <p className="text-gray-600 text-sm">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
