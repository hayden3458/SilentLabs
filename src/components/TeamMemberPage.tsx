import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamMembers } from '../Team';

const TeamMemberPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const member = teamMembers.find(m => m.name === name);

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-nature-glass text-white">
        <h1 className="text-3xl font-bold mb-4">Team Member Not Found</h1>
        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-glassgreen-500 text-glassblue-900 font-semibold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nature-glass text-white font-inter flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-white/10 rounded-3xl shadow-glass p-8 flex flex-col">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">{member.name}</h1>
        <h2 className="text-xl font-semibold mb-6 text-gray-900">{member.role} - {member.bio}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-bold text-gray-900 mb-1">PHONE</div>
            <div className="text-lg font-mono text-gray-900 bg-white/20 rounded px-2 py-1 inline-block">(555) 123-4567</div>
          </div>
          <div>
            <div className="font-bold text-gray-900 mb-1">EMAIL</div>
            <div className="text-lg font-mono text-gray-900 bg-white/20 rounded px-2 py-1 inline-block">{member.name.toLowerCase().replace(/ /g, '')}@silentlabs.com</div>
          </div>
        </div>
        <div className="mb-8">
          <div className="font-bold text-gray-900 mb-1">ROLE</div>
          <div className="text-lg text-gray-900 bg-white/20 rounded px-2 py-1 inline-block">Backend</div>
        </div>
        <hr className="border-t-2 border-glassgreen-500 my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="font-bold text-gray-900 mb-1">DIVISION</div>
            <div className="text-lg text-gray-900 bg-white/20 rounded px-2 py-1 inline-block">Tech</div>
          </div>
          <div>
            <div className="font-bold text-gray-900 mb-1">DEPARTMENT</div>
            <div className="text-lg text-gray-900 bg-white/20 rounded px-2 py-1 inline-block">Tech</div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="mt-10 px-6 py-2 rounded-full bg-glassgreen-500 text-glassblue-900 font-semibold shadow-glass hover:bg-glassgreen-400 transition self-center">Back to Team</button>
      </div>
    </div>
  );
};

export default TeamMemberPage; 