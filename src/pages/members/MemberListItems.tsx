/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchMembers, removeMember } from "../../context/members/actions";
import { useMembersState, useMembersDispatch } from "../../context/members/context";
import { useIsAdmin } from "../../context/auth/context";
import { useCurrentUser } from "../../context/auth/context";

export default function MemberListItems() {
  const dispatchMembers = useMembersDispatch();
  const state: any      = useMembersState();
  const isAdmin         = useIsAdmin();
  const currentUser     = useCurrentUser();

  if (!state) return <span>Loading...</span>;

  const { members, isLoading, isError, errorMessage } = state;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this member from the system?")) return;
    try {
      const result = await removeMember(dispatchMembers, id);
      if (result.ok) await fetchMembers(dispatchMembers);
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  if (isLoading && (!members || members.length === 0)) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm">
        {errorMessage}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-2">👥</div>
        <p className="text-slate-400 text-sm">No members yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {members.map((member: any) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
              {member.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {member.name}
              </p>
              <p className="text-xs text-slate-400">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Role badge */}
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                member.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              }`}
            >
              {member.role ?? "MEMBER"}
            </span>

            {/* Delete — admin only, can't delete self */}
            {isAdmin && member.id !== currentUser?.id && (
              <button
                type="button"
                id={`delete-member-${member.id}`}
                onClick={() => handleDelete(member.id)}
                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                title="Remove member"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
