import "@/app/globals.css"

export default function DB_Table() {
    return (
        <div className="table">
            <div className="table-header">
                <div className="table-field">ID</div>
                <div className="table-field">Titlul</div>
                <div className="table-field">Autorul</div>
                <div className="table-field">Anul publicarii</div>
                <div className="table-field">Genul</div>
            </div>
        </div>
    );
}