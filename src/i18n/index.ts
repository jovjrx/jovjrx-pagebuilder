import { MultiLanguageContent } from '../types'

// Supported languages
export const supportedLanguages = {
  'pt-BR': 'Português (Brasil)',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
}

// Default translations for the editor interface
export const translations = {
  'pt-BR': {
    // Editor interface
    'editor.title': 'Editor de Páginas',
    'editor.addBlock': 'Adicionar Bloco',
    'editor.save': 'Salvar',
    'editor.preview': 'Visualizar',
    'editor.publish': 'Publicar',
    'editor.draft': 'Rascunho',
    'editor.settings': 'Configurações',
    'editor.language': 'Idioma',
    
    // Block types
    'block.hero': 'Seção Principal',
    'block.features': 'Benefícios',
    'block.testimonials': 'Depoimentos',
    'block.pricing': 'Preços',
    'block.faq': 'Perguntas Frequentes',
    'block.stats': 'Estatísticas',
    'block.text': 'Texto',
    'block.media': 'Mídia',
    'block.list': 'Lista',
    'block.actions': 'Botões de Ação',
    'block.timer': 'Contador',
    
    // Content types
    'content.heading': 'Título',
    'content.subtitle': 'Subtítulo',
    'content.paragraph': 'Parágrafo',
    'content.image': 'Imagem',
    'content.video': 'Vídeo',
    'content.button': 'Botão',
    
    // Actions
    'action.edit': 'Editar',
    'action.delete': 'Excluir',
    'action.duplicate': 'Duplicar',
    'action.moveUp': 'Mover para Cima',
    'action.moveDown': 'Mover para Baixo',
    'action.cancel': 'Cancelar',
    'action.confirm': 'Confirmar',
    
    // Messages
    'message.saved': 'Página salva com sucesso!',
    'message.error': 'Erro ao salvar página',
    'message.loading': 'Carregando...',
    'message.noBlocks': 'Nenhum bloco adicionado. Clique em "Adicionar Bloco" para começar.',
    
    // Placeholders
    'placeholder.title': 'Digite o título...',
    'placeholder.subtitle': 'Digite o subtítulo...',
    'placeholder.text': 'Digite o texto...',
    'placeholder.url': 'https://...',
    'placeholder.buttonText': 'Clique aqui',
  },
  
  'en': {
    // Editor interface
    'editor.title': 'Page Editor',
    'editor.addBlock': 'Add Block',
    'editor.save': 'Save',
    'editor.preview': 'Preview',
    'editor.publish': 'Publish',
    'editor.draft': 'Draft',
    'editor.settings': 'Settings',
    'editor.language': 'Language',
    
    // Block types
    'block.hero': 'Hero Section',
    'block.features': 'Features',
    'block.testimonials': 'Testimonials',
    'block.pricing': 'Pricing',
    'block.faq': 'FAQ',
    'block.stats': 'Statistics',
    'block.text': 'Text',
    'block.media': 'Media',
    'block.list': 'List',
    'block.actions': 'Action Buttons',
    'block.timer': 'Timer',
    
    // Content types
    'content.heading': 'Heading',
    'content.subtitle': 'Subtitle',
    'content.paragraph': 'Paragraph',
    'content.image': 'Image',
    'content.video': 'Video',
    'content.button': 'Button',
    
    // Actions
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.duplicate': 'Duplicate',
    'action.moveUp': 'Move Up',
    'action.moveDown': 'Move Down',
    'action.cancel': 'Cancel',
    'action.confirm': 'Confirm',
    
    // Messages
    'message.saved': 'Page saved successfully!',
    'message.error': 'Error saving page',
    'message.loading': 'Loading...',
    'message.noBlocks': 'No blocks added. Click "Add Block" to get started.',
    
    // Placeholders
    'placeholder.title': 'Enter title...',
    'placeholder.subtitle': 'Enter subtitle...',
    'placeholder.text': 'Enter text...',
    'placeholder.url': 'https://...',
    'placeholder.buttonText': 'Click here',
  },
  
  'es': {
    // Editor interface
    'editor.title': 'Editor de Páginas',
    'editor.addBlock': 'Agregar Bloque',
    'editor.save': 'Guardar',
    'editor.preview': 'Vista Previa',
    'editor.publish': 'Publicar',
    'editor.draft': 'Borrador',
    'editor.settings': 'Configuración',
    'editor.language': 'Idioma',
    
    // Block types
    'block.hero': 'Sección Principal',
    'block.features': 'Características',
    'block.testimonials': 'Testimonios',
    'block.pricing': 'Precios',
    'block.faq': 'Preguntas Frecuentes',
    'block.stats': 'Estadísticas',
    'block.text': 'Texto',
    'block.media': 'Media',
    'block.list': 'Lista',
    'block.actions': 'Botones de Acción',
    'block.timer': 'Temporizador',
    
    // Content types
    'content.heading': 'Título',
    'content.subtitle': 'Subtítulo',
    'content.paragraph': 'Párrafo',
    'content.image': 'Imagen',
    'content.video': 'Video',
    'content.button': 'Botón',
    
    // Actions
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.duplicate': 'Duplicar',
    'action.moveUp': 'Mover Arriba',
    'action.moveDown': 'Mover Abajo',
    'action.cancel': 'Cancelar',
    'action.confirm': 'Confirmar',
    
    // Messages
    'message.saved': '¡Página guardada exitosamente!',
    'message.error': 'Error al guardar página',
    'message.loading': 'Cargando...',
    'message.noBlocks': 'No hay bloques agregados. Haz clic en "Agregar Bloque" para comenzar.',
    
    // Placeholders
    'placeholder.title': 'Ingresa el título...',
    'placeholder.subtitle': 'Ingresa el subtítulo...',
    'placeholder.text': 'Ingresa el texto...',
    'placeholder.url': 'https://...',
    'placeholder.buttonText': 'Haz clic aquí',
  }
}

// Utility functions
export function getTranslation(key: string, language: string = 'pt-BR'): string {
  const lang = translations[language as keyof typeof translations] || translations['pt-BR']
  return lang[key as keyof typeof lang] || key
}

export function getMultiLanguageValue(content: MultiLanguageContent, language: string = 'pt-BR'): string {
  return content[language] || content['pt-BR'] || content[Object.keys(content)[0]] || ''
}

export function createMultiLanguageContent(value: string, language: string = 'pt-BR'): MultiLanguageContent {
  return { [language]: value }
}

export function updateMultiLanguageContent(
  content: MultiLanguageContent, 
  value: string, 
  language: string
): MultiLanguageContent {
  return { ...content, [language]: value }
}

export function isLanguageSupported(language: string): boolean {
  return language in supportedLanguages
}

export function getLanguageName(language: string): string {
  return supportedLanguages[language as keyof typeof supportedLanguages] || language
}
