
function CommentsComponent(props: { postId: string }) {
    console.log(props);
    return (
        <div className="comment">
            <p className="comment-author">Author Name</p>
            <p className="comment-content">This is a comment content.</p>
        </div>
    );
}

export default CommentsComponent;