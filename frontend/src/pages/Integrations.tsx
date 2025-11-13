import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiSettings, FiInbox, FiMessageCircle, FiGlobe, FiX, FiBarChart2, FiHelpCircle, FiChevronDown, FiEdit, FiTrash2, FiChevronRight } from 'react-icons/fi';

type TabType = 'entradas' | 'saidas' | 'atualizacao' | 'produtos' | 'parceiros' | 'meta-api';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive';
  tab: TabType;
}

interface WebhookIntegration {
  id: string;
  title: string;
  online: boolean;
  queue: string;
  queueName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

const tabs = [
  { id: 'entradas' as TabType, label: 'Entradas de lead' },
  { id: 'saidas' as TabType, label: 'Saídas de lead' },
  { id: 'atualizacao' as TabType, label: 'Atualização do lead' },
  { id: 'produtos' as TabType, label: 'Produtos' },
  { id: 'parceiros' as TabType, label: 'Parceiros Oficiais' },
  { id: 'meta-api' as TabType, label: 'API de conversão Meta' },
];

const tabDescriptions: Record<TabType, string> = {
  entradas: 'Crie e configure os pontos de entrada de leads',
  saidas: 'Configure os pontos de saída de leads',
  atualizacao: 'Configure as atualizações automáticas de leads',
  produtos: 'Gerencie os produtos disponíveis',
  parceiros: 'Configure parceiros oficiais',
  'meta-api': 'Configure a API de conversão do Meta',
};

// Mock data - em produção viria de uma API
const integrations: Integration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Envie leads para o WhatsApp',
    icon: <FiMessageCircle className="w-6 h-6" />,
    status: 'active',
    tab: 'saidas',
  },
];

// Integrações disponíveis para adicionar
interface AvailableIntegration {
  id: string;
  name: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
}

const availableIntegrations: AvailableIntegration[] = [
  {
    id: 'webhook',
    name: 'Webhook',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="3.5" fill="currentColor" />
        <circle cx="5.5" cy="19" r="3.5" fill="currentColor" />
        <circle cx="18.5" cy="19" r="3.5" fill="currentColor" />
        <path d="M 12 8.5 Q 5.5 13 5.5 19" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 12 8.5 Q 18.5 13 18.5 19" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 5.5 19 Q 12 19 18.5 19" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
      </svg>
    ),
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    iconColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'rd-station',
    name: 'RD Station',
    icon: <FiBarChart2 className="w-8 h-8" />,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'site',
    name: 'Site',
    icon: <FiGlobe className="w-8 h-8" />,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <FiMessageCircle className="w-8 h-8" />,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
];

export default function Integrations() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('entradas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [webhookTitle, setWebhookTitle] = useState('');
  const [webhookOnline, setWebhookOnline] = useState(true);
  const [webhookQueue, setWebhookQueue] = useState('');
  const [showQueueDropdown, setShowQueueDropdown] = useState(false);
  const [webhookIntegrations, setWebhookIntegrations] = useState<WebhookIntegration[]>([]);
  const [facebookTitle, setFacebookTitle] = useState('');
  const [facebookStep, setFacebookStep] = useState(1);

  // Filtrar integrações pela aba ativa
  const activeIntegrations = integrations.filter(integration => integration.tab === activeTab);

  // Mock de filas disponíveis
  const availableQueues = [
    { id: '1', name: 'Fila Principal' },
    { id: '2', name: 'Fila Secundária' },
    { id: '3', name: 'Fila de Suporte' },
  ];

  const handleAddIntegration = (integrationId: string) => {
    if (integrationId === 'webhook') {
      setShowAddModal(false);
      setShowWebhookModal(true);
    } else if (integrationId === 'facebook') {
      setShowAddModal(false);
      setShowFacebookModal(true);
      setFacebookStep(1);
      setFacebookTitle('');
    } else {
      // Aqui você pode adicionar a lógica para adicionar outras integrações
      console.log('Adicionar integração:', integrationId);
      setShowAddModal(false);
    }
  };

  const handleCreateWebhook = () => {
    if (!webhookTitle.trim()) {
      alert('Por favor, preencha o título');
      return;
    }

    const now = new Date();
    const newWebhook: WebhookIntegration = {
      id: `webhook-${Date.now()}`,
      title: webhookTitle,
      online: webhookOnline,
      queue: webhookQueue,
      queueName: availableQueues.find(q => q.id === webhookQueue)?.name || '',
      createdBy: user?.name?.toUpperCase() || 'USUÁRIO',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      type: 'N8N IA',
    };

    setWebhookIntegrations([...webhookIntegrations, newWebhook]);
    
    // Resetar formulário
    setWebhookTitle('');
    setWebhookOnline(true);
    setWebhookQueue('');
    setShowWebhookModal(false);
  };

  const handleDeleteWebhook = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta integração?')) {
      setWebhookIntegrations(webhookIntegrations.filter(w => w.id !== id));
    }
  };

  const handleCopyWebhook = (webhook: WebhookIntegration) => {
    const now = new Date();
    const copiedWebhook: WebhookIntegration = {
      ...webhook,
      id: `webhook-${Date.now()}`,
      title: `${webhook.title} (Cópia)`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    setWebhookIntegrations([...webhookIntegrations, copiedWebhook]);
  };

  const handleEditWebhook = (id: string) => {
    const webhook = webhookIntegrations.find(w => w.id === id);
    if (webhook) {
      setWebhookTitle(webhook.title);
      setWebhookOnline(webhook.online);
      setWebhookQueue(webhook.queue);
      setWebhookIntegrations(webhookIntegrations.filter(w => w.id !== id));
      setShowWebhookModal(true);
    }
  };

  const handleToggleWebhookStatus = (id: string) => {
    setWebhookIntegrations(webhookIntegrations.map(w => 
      w.id === id ? { ...w, online: !w.online, updatedAt: new Date().toISOString() } : w
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const handleCloseWebhookModal = () => {
    setShowWebhookModal(false);
    setWebhookTitle('');
    setWebhookOnline(true);
    setWebhookQueue('');
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowQueueDropdown(false);
      }
    };

    if (showQueueDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showQueueDropdown]);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">{tabDescriptions[activeTab]}</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex items-center justify-end space-x-4">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Adicionar integração</span>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <FiSettings className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      {(activeIntegrations.length > 0 || webhookIntegrations.length > 0) ? (
        <div className="space-y-4">
          {/* Webhook Integrations */}
          {webhookIntegrations.length > 0 && (
            <div className="space-y-4">
              {webhookIntegrations.map((webhook) => (
                <div key={webhook.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    {/* Left Side - Icons and Name */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Large Webhook Icon */}
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="3.5" fill="currentColor" />
                          <circle cx="5.5" cy="19" r="3.5" fill="currentColor" />
                          <circle cx="18.5" cy="19" r="3.5" fill="currentColor" />
                          <path d="M 12 8.5 Q 5.5 13 5.5 19" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d="M 12 8.5 Q 18.5 13 18.5 19" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d="M 5.5 19 Q 12 19 18.5 19" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </svg>
                      </div>
                      
                      {/* Name and Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{webhook.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">Criado por: {webhook.createdBy}</p>
                        <p className="text-sm text-gray-600">Atualizado em: {formatDate(webhook.updatedAt)}</p>
                      </div>
                    </div>

                    {/* Right Side - Type and Status */}
                    <div className="flex flex-col items-end gap-3">
                      {webhook.type && (
                        <span className="text-sm font-medium text-gray-700">{webhook.type}</span>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600">Online</span>
                        <button
                          onClick={() => handleToggleWebhookStatus(webhook.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            webhook.online ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              webhook.online ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      title="Excluir"
                    >
                      <FiTrash2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleCopyWebhook(webhook)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      title="Copiar"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditWebhook(webhook.id)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      title="Editar"
                    >
                      <FiEdit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Integrations */}
          {activeIntegrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {integration.icon}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {integration.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {/* Illustration */}
            <div className="relative mb-6">
              {/* Speech bubble with dots */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-200 rounded-lg p-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                </div>
              </div>
              
              {/* Inbox icon */}
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiInbox className="w-12 h-12 text-gray-400" />
                  {/* Document inside */}
                  <div className="absolute bottom-2 right-2 w-8 h-10 bg-gray-200 rounded-sm transform rotate-12"></div>
                </div>
              </div>
            </div>

            {/* Empty State Text */}
            <p className="text-gray-500 text-sm">Nenhuma integração cadastrada</p>
          </div>
        </div>
      )}

      {/* Modal Adicionar Integração */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Adicionar integração</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Selecione o tipo de integração que deseja adicionar
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableIntegrations.map((integration) => (
                  <button
                    key={integration.id}
                    onClick={() => handleAddIntegration(integration.id)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className={`w-16 h-16 ${integration.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${integration.iconColor}`}>
                      {integration.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{integration.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configuração Facebook */}
      {showFacebookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Adicionar uma nova integração</h2>
              <button
                onClick={() => {
                  setShowFacebookModal(false);
                  setFacebookTitle('');
                  setFacebookStep(1);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Campo Título */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Título da integração:
                </label>
                <input
                  type="text"
                  value={facebookTitle}
                  onChange={(e) => setFacebookTitle(e.target.value)}
                  placeholder="Título da integração"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Passos da Integração */}
              <div className="space-y-4">
                {/* Passo 1 - Conta do Facebook */}
                <div 
                  onClick={() => setFacebookStep(1)}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    facebookStep === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  } hover:border-blue-300`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    facebookStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      facebookStep === 1 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Conta do Facebook
                    </h3>
                    <p className={`text-sm ${
                      facebookStep === 1 ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      Escolha ou adicione contas do facebook
                    </p>
                  </div>
                  {facebookStep === 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFacebookStep(2);
                      }}
                      className="flex-shrink-0 text-blue-600 hover:text-blue-700"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Passo 2 - Página e Fila */}
                <div 
                  onClick={() => facebookStep >= 2 && setFacebookStep(2)}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    facebookStep === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  } ${facebookStep >= 2 ? 'hover:border-blue-300' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    facebookStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      facebookStep === 2 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Página e Fila
                    </h3>
                    <p className={`text-sm ${
                      facebookStep === 2 ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      Escolha quais páginas você deseja receber cadastros
                    </p>
                  </div>
                </div>

                {/* Passo 3 - Testar integração */}
                <div 
                  onClick={() => facebookStep >= 3 && setFacebookStep(3)}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    facebookStep === 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  } ${facebookStep >= 3 ? 'hover:border-blue-300' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    facebookStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      facebookStep === 3 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Testar integração
                    </h3>
                    <p className={`text-sm ${
                      facebookStep === 3 ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      Clique aqui para abrir a ferramenta de teste do Facebook
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowFacebookModal(false);
                  setFacebookTitle('');
                  setFacebookStep(1);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configuração Webhook */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Deseja fazer integração com Webhook?</h2>
              <button
                onClick={handleCloseWebhookModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Texto explicativo */}
              <div className="mb-6 flex items-start gap-2">
                <p className="text-sm text-gray-600 flex-1">
                  Para realizar integração com Webhook, basta registrar essa integração e configurar com a URL gerada abaixo!
                </p>
                <FiHelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              </div>

              {/* Campo Título */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Título:</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Online:</span>
                    <button
                      onClick={() => setWebhookOnline(!webhookOnline)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        webhookOnline ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          webhookOnline ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={webhookTitle}
                  onChange={(e) => setWebhookTitle(e.target.value)}
                  placeholder="Título"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo Fila */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Fila:</label>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowQueueDropdown(!showQueueDropdown)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white text-left"
                  >
                    <span className={webhookQueue ? 'text-gray-900' : 'text-gray-500'}>
                      {webhookQueue 
                        ? availableQueues.find(q => q.id === webhookQueue)?.name 
                        : 'Selecione uma fila'}
                    </span>
                    <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showQueueDropdown ? 'transform rotate-180' : ''}`} />
                  </button>
                  {showQueueDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {availableQueues.map((queue) => (
                        <button
                          key={queue.id}
                          type="button"
                          onClick={() => {
                            setWebhookQueue(queue.id);
                            setShowQueueDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm text-gray-900">{queue.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseWebhookModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={handleCreateWebhook}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar integração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

