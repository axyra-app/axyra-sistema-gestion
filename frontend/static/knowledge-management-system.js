/**
 * AXYRA - Sistema de Gestión de Conocimiento y Documentación
 * Maneja artículos, wikis, FAQs, tutoriales, versiones y colaboración
 */

class AxyraKnowledgeManagementSystem {
  constructor() {
    this.articles = [];
    this.categories = [];
    this.tags = [];
    this.versions = [];
    this.comments = [];
    this.ratings = [];
    this.favorites = [];
    this.searchHistory = [];
    this.templates = [];
    this.workflows = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('📚 Inicializando sistema de gestión de conocimiento...');
    this.loadArticles();
    this.loadCategories();
    this.loadTags();
    this.loadVersions();
    this.loadComments();
    this.loadRatings();
    this.loadFavorites();
    this.loadSearchHistory();
    this.loadTemplates();
    this.loadWorkflows();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadArticles() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_articles');
      if (stored) {
        this.articles = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando artículos:', error);
    }
  }

  saveArticles() {
    try {
      localStorage.setItem('axyra_knowledge_articles', JSON.stringify(this.articles));
    } catch (error) {
      console.error('Error guardando artículos:', error);
    }
  }

  loadCategories() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_categories');
      if (stored) {
        this.categories = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando categorías:', error);
    }
  }

  saveCategories() {
    try {
      localStorage.setItem('axyra_knowledge_categories', JSON.stringify(this.categories));
    } catch (error) {
      console.error('Error guardando categorías:', error);
    }
  }

  loadTags() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_tags');
      if (stored) {
        this.tags = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando etiquetas:', error);
    }
  }

  saveTags() {
    try {
      localStorage.setItem('axyra_knowledge_tags', JSON.stringify(this.tags));
    } catch (error) {
      console.error('Error guardando etiquetas:', error);
    }
  }

  loadVersions() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_versions');
      if (stored) {
        this.versions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando versiones:', error);
    }
  }

  saveVersions() {
    try {
      localStorage.setItem('axyra_knowledge_versions', JSON.stringify(this.versions));
    } catch (error) {
      console.error('Error guardando versiones:', error);
    }
  }

  loadComments() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_comments');
      if (stored) {
        this.comments = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando comentarios:', error);
    }
  }

  saveComments() {
    try {
      localStorage.setItem('axyra_knowledge_comments', JSON.stringify(this.comments));
    } catch (error) {
      console.error('Error guardando comentarios:', error);
    }
  }

  loadRatings() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_ratings');
      if (stored) {
        this.ratings = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando calificaciones:', error);
    }
  }

  saveRatings() {
    try {
      localStorage.setItem('axyra_knowledge_ratings', JSON.stringify(this.ratings));
    } catch (error) {
      console.error('Error guardando calificaciones:', error);
    }
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_favorites');
      if (stored) {
        this.favorites = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando favoritos:', error);
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('axyra_knowledge_favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error guardando favoritos:', error);
    }
  }

  loadSearchHistory() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_search_history');
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando historial de búsqueda:', error);
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem('axyra_knowledge_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error guardando historial de búsqueda:', error);
    }
  }

  loadTemplates() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_templates');
      if (stored) {
        this.templates = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando plantillas:', error);
    }
  }

  saveTemplates() {
    try {
      localStorage.setItem('axyra_knowledge_templates', JSON.stringify(this.templates));
    } catch (error) {
      console.error('Error guardando plantillas:', error);
    }
  }

  loadWorkflows() {
    try {
      const stored = localStorage.getItem('axyra_knowledge_workflows');
      if (stored) {
        this.workflows = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando flujos de trabajo:', error);
    }
  }

  saveWorkflows() {
    try {
      localStorage.setItem('axyra_knowledge_workflows', JSON.stringify(this.workflows));
    } catch (error) {
      console.error('Error guardando flujos de trabajo:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en artículos
    document.addEventListener('articleChanged', (event) => {
      this.handleArticleChange(event.detail);
    });

    // Escuchar cambios en categorías
    document.addEventListener('categoryChanged', (event) => {
      this.handleCategoryChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.categories.length === 0) {
      this.categories = [
        {
          id: 'general',
          name: 'General',
          description: 'Información general de la empresa',
          parentId: null,
          isActive: true,
        },
        {
          id: 'procedures',
          name: 'Procedimientos',
          description: 'Procedimientos y procesos internos',
          parentId: null,
          isActive: true,
        },
        {
          id: 'faq',
          name: 'Preguntas Frecuentes',
          description: 'Preguntas y respuestas comunes',
          parentId: null,
          isActive: true,
        },
        {
          id: 'tutorials',
          name: 'Tutoriales',
          description: 'Guías paso a paso',
          parentId: null,
          isActive: true,
        },
      ];
      this.saveCategories();
    }

    if (this.tags.length === 0) {
      this.tags = [
        { id: 'important', name: 'Importante', color: '#ff4444' },
        { id: 'urgent', name: 'Urgente', color: '#ff8800' },
        { id: 'new', name: 'Nuevo', color: '#00aa00' },
        { id: 'updated', name: 'Actualizado', color: '#0088ff' },
        { id: 'deprecated', name: 'Obsoleto', color: '#888888' },
      ];
      this.saveTags();
    }

    if (this.templates.length === 0) {
      this.templates = [
        {
          id: 'article_template',
          name: 'Plantilla de Artículo',
          type: 'article',
          content: '# Título del Artículo\n\n## Resumen\n\n## Contenido Principal\n\n## Conclusión\n\n## Referencias',
          isActive: true,
        },
        {
          id: 'faq_template',
          name: 'Plantilla de FAQ',
          type: 'faq',
          content: '## Pregunta\n\n**P:** ¿Pregunta frecuente?\n\n**R:** Respuesta detallada.\n\n## Referencias',
          isActive: true,
        },
        {
          id: 'tutorial_template',
          name: 'Plantilla de Tutorial',
          type: 'tutorial',
          content:
            '# Tutorial: [Título]\n\n## Objetivo\n\n## Requisitos Previos\n\n## Pasos\n\n### Paso 1: [Descripción]\n\n### Paso 2: [Descripción]\n\n## Conclusión',
          isActive: true,
        },
      ];
      this.saveTemplates();
    }
  }

  handleArticleChange(change) {
    const { articleId, action, data } = change;

    switch (action) {
      case 'created':
        this.articles.push(data);
        this.saveArticles();
        break;
      case 'updated':
        const articleIndex = this.articles.findIndex((a) => a.id === articleId);
        if (articleIndex !== -1) {
          this.articles[articleIndex] = { ...this.articles[articleIndex], ...data };
          this.saveArticles();
        }
        break;
      case 'deleted':
        this.articles = this.articles.filter((a) => a.id !== articleId);
        this.saveArticles();
        break;
    }
  }

  handleCategoryChange(change) {
    const { categoryId, action, data } = change;

    switch (action) {
      case 'created':
        this.categories.push(data);
        this.saveCategories();
        break;
      case 'updated':
        const categoryIndex = this.categories.findIndex((c) => c.id === categoryId);
        if (categoryIndex !== -1) {
          this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...data };
          this.saveCategories();
        }
        break;
      case 'deleted':
        this.categories = this.categories.filter((c) => c.id !== categoryId);
        this.saveCategories();
        break;
    }
  }

  createArticle(articleData) {
    const article = {
      id: 'article_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: articleData.title,
      content: articleData.content,
      summary: articleData.summary || '',
      categoryId: articleData.categoryId,
      tags: articleData.tags || [],
      author: articleData.author || this.getCurrentUser(),
      status: articleData.status || 'draft', // draft, published, archived
      visibility: articleData.visibility || 'public', // public, private, restricted
      version: articleData.version || 1,
      views: articleData.views || 0,
      likes: articleData.likes || 0,
      isActive: articleData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.articles.push(article);
    this.saveArticles();

    console.log('✅ Artículo creado:', article.title);
    return article;
  }

  createCategory(categoryData) {
    const category = {
      id: 'category_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: categoryData.name,
      description: categoryData.description || '',
      parentId: categoryData.parentId || null,
      isActive: categoryData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.categories.push(category);
    this.saveCategories();

    console.log('✅ Categoría creada:', category.name);
    return category;
  }

  createTag(tagData) {
    const tag = {
      id: 'tag_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: tagData.name,
      color: tagData.color || '#4285f4',
      description: tagData.description || '',
      isActive: tagData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.tags.push(tag);
    this.saveTags();

    console.log('✅ Etiqueta creada:', tag.name);
    return tag;
  }

  createVersion(versionData) {
    const version = {
      id: 'version_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      articleId: versionData.articleId,
      version: versionData.version,
      content: versionData.content,
      changes: versionData.changes || '',
      author: versionData.author || this.getCurrentUser(),
      isActive: versionData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.versions.push(version);
    this.saveVersions();

    console.log('✅ Versión creada:', version.id);
    return version;
  }

  createComment(commentData) {
    const comment = {
      id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      articleId: commentData.articleId,
      content: commentData.content,
      author: commentData.author || this.getCurrentUser(),
      parentId: commentData.parentId || null,
      isActive: commentData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.comments.push(comment);
    this.saveComments();

    console.log('✅ Comentario creado:', comment.id);
    return comment;
  }

  createRating(ratingData) {
    const rating = {
      id: 'rating_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      articleId: ratingData.articleId,
      rating: ratingData.rating, // 1-5
      comment: ratingData.comment || '',
      author: ratingData.author || this.getCurrentUser(),
      isActive: ratingData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.ratings.push(rating);
    this.saveRatings();

    console.log('✅ Calificación creada:', rating.id);
    return rating;
  }

  createTemplate(templateData) {
    const template = {
      id: 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: templateData.name,
      type: templateData.type, // article, faq, tutorial
      content: templateData.content,
      isActive: templateData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.templates.push(template);
    this.saveTemplates();

    console.log('✅ Plantilla creada:', template.name);
    return template;
  }

  createWorkflow(workflowData) {
    const workflow = {
      id: 'workflow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: workflowData.name,
      description: workflowData.description || '',
      steps: workflowData.steps || [],
      isActive: workflowData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.workflows.push(workflow);
    this.saveWorkflows();

    console.log('✅ Flujo de trabajo creado:', workflow.name);
    return workflow;
  }

  searchArticles(query, filters = {}) {
    const searchTerm = query.toLowerCase();
    let results = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm)
    );

    if (filters.categoryId) {
      results = results.filter((article) => article.categoryId === filters.categoryId);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((article) => filters.tags.some((tag) => article.tags.includes(tag)));
    }

    if (filters.status) {
      results = results.filter((article) => article.status === filters.status);
    }

    if (filters.author) {
      results = results.filter((article) => article.author === filters.author);
    }

    // Guardar en historial de búsqueda
    this.addToSearchHistory(query);

    return results.sort((a, b) => b.views - a.views);
  }

  addToSearchHistory(query) {
    const historyItem = {
      id: 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      query,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUser(),
    };

    this.searchHistory.unshift(historyItem);

    // Mantener solo las últimas 50 búsquedas
    if (this.searchHistory.length > 50) {
      this.searchHistory = this.searchHistory.slice(0, 50);
    }

    this.saveSearchHistory();
  }

  getPopularArticles(limit = 10) {
    return this.articles
      .filter((article) => article.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  getRecentArticles(limit = 10) {
    return this.articles
      .filter((article) => article.status === 'published')
      .sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt))
      .slice(0, limit);
  }

  getKnowledgeStatistics() {
    const totalArticles = this.articles.length;
    const publishedArticles = this.articles.filter((a) => a.status === 'published').length;
    const draftArticles = this.articles.filter((a) => a.status === 'draft').length;
    const totalCategories = this.categories.length;
    const totalTags = this.tags.length;
    const totalComments = this.comments.length;
    const totalRatings = this.ratings.length;
    const averageRating =
      this.ratings.length > 0 ? this.ratings.reduce((sum, r) => sum + r.rating, 0) / this.ratings.length : 0;
    const totalViews = this.articles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = this.articles.reduce((sum, a) => sum + a.likes, 0);

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalTags,
      totalComments,
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalViews,
      totalLikes,
    };
  }

  showKnowledgeDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'knowledge-dashboard';
    dashboard.innerHTML = `
      <div class="knowledge-dashboard-overlay">
        <div class="knowledge-dashboard-container">
          <div class="knowledge-dashboard-header">
            <h3>📚 Dashboard de Conocimiento</h3>
            <div class="knowledge-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraKnowledgeManagementSystem.showCreateArticleDialog()">Nuevo Artículo</button>
              <button class="btn btn-secondary" onclick="axyraKnowledgeManagementSystem.showCreateCategoryDialog()">Nueva Categoría</button>
              <button class="btn btn-close" onclick="document.getElementById('knowledge-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="knowledge-dashboard-body">
            <div class="knowledge-dashboard-stats">
              ${this.renderKnowledgeStats()}
            </div>
            <div class="knowledge-dashboard-content">
              <div class="knowledge-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="articles">Artículos</button>
                <button class="tab-btn" data-tab="categories">Categorías</button>
                <button class="tab-btn" data-tab="search">Búsqueda</button>
                <button class="tab-btn" data-tab="templates">Plantillas</button>
              </div>
              <div class="knowledge-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="articles-tab">
                  ${this.renderArticlesList()}
                </div>
                <div class="tab-content" id="categories-tab">
                  ${this.renderCategoriesList()}
                </div>
                <div class="tab-content" id="search-tab">
                  ${this.renderSearchInterface()}
                </div>
                <div class="tab-content" id="templates-tab">
                  ${this.renderTemplatesList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    dashboard.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(dashboard);

    // Configurar tabs
    const tabBtns = dashboard.querySelectorAll('.tab-btn');
    const tabContents = dashboard.querySelectorAll('.tab-content');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  }

  renderKnowledgeStats() {
    const stats = this.getKnowledgeStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalArticles}</div>
          <div class="stat-label">Total Artículos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.publishedArticles}</div>
          <div class="stat-label">Artículos Publicados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.draftArticles}</div>
          <div class="stat-label">Borradores</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCategories}</div>
          <div class="stat-label">Categorías</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTags}</div>
          <div class="stat-label">Etiquetas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalComments}</div>
          <div class="stat-label">Comentarios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.averageRating}/5</div>
          <div class="stat-label">Calificación Promedio</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalViews}</div>
          <div class="stat-label">Total Vistas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalLikes}</div>
          <div class="stat-label">Total Me Gusta</div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const stats = this.getKnowledgeStatistics();
    const popularArticles = this.getPopularArticles(5);
    const recentArticles = this.getRecentArticles(5);

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Artículos Populares</h4>
          <div class="popular-articles">
            ${popularArticles
              .map(
                (article) => `
              <div class="article-item">
                <span class="article-title">${article.title}</span>
                <span class="article-views">${article.views} vistas</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="overview-card">
          <h4>Artículos Recientes</h4>
          <div class="recent-articles">
            ${recentArticles
              .map(
                (article) => `
              <div class="article-item">
                <span class="article-title">${article.title}</span>
                <span class="article-date">${new Date(article.metadata.createdAt).toLocaleDateString()}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="overview-card">
          <h4>Estadísticas</h4>
          <div class="knowledge-stats">
            <div class="stat-item">
              <span>Artículos Publicados</span>
              <span>${stats.publishedArticles}</span>
            </div>
            <div class="stat-item">
              <span>Total Vistas</span>
              <span>${stats.totalViews}</span>
            </div>
            <div class="stat-item">
              <span>Calificación Promedio</span>
              <span>${stats.averageRating}/5</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderArticlesList() {
    const articles = this.articles.slice(-20); // Últimos 20 artículos

    return articles
      .map(
        (article) => `
      <div class="article-card">
        <div class="article-header">
          <h5>${article.title}</h5>
          <span class="article-status status-${article.status}">${article.status}</span>
        </div>
        <div class="article-info">
          <p>${article.summary}</p>
          <p>Autor: ${article.author}</p>
          <p>Vistas: ${article.views}</p>
          <p>Me Gusta: ${article.likes}</p>
          <p>Fecha: ${new Date(article.metadata.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="article-actions">
          <button onclick="axyraKnowledgeManagementSystem.showArticleDetails('${article.id}')">Ver</button>
          <button onclick="axyraKnowledgeManagementSystem.editArticle('${article.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderCategoriesList() {
    const categories = this.categories;

    return categories
      .map(
        (category) => `
      <div class="category-card">
        <div class="category-header">
          <h5>${category.name}</h5>
          <span class="category-status ${category.isActive ? 'active' : 'inactive'}">${
          category.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="category-info">
          <p>${category.description}</p>
        </div>
        <div class="category-actions">
          <button onclick="axyraKnowledgeManagementSystem.showCategoryDetails('${category.id}')">Ver</button>
          <button onclick="axyraKnowledgeManagementSystem.editCategory('${category.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderSearchInterface() {
    return `
      <div class="search-interface">
        <div class="search-box">
          <input type="text" id="knowledge-search" placeholder="Buscar artículos..." onkeyup="axyraKnowledgeManagementSystem.performSearch(this.value)">
          <button onclick="axyraKnowledgeManagementSystem.performSearch(document.getElementById('knowledge-search').value)">Buscar</button>
        </div>
        <div class="search-filters">
          <select id="category-filter" onchange="axyraKnowledgeManagementSystem.applyFilters()">
            <option value="">Todas las categorías</option>
            ${this.categories
              .map(
                (category) => `
              <option value="${category.id}">${category.name}</option>
            `
              )
              .join('')}
          </select>
          <select id="status-filter" onchange="axyraKnowledgeManagementSystem.applyFilters()">
            <option value="">Todos los estados</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
        <div class="search-results" id="search-results">
          <div class="search-placeholder">Ingresa un término de búsqueda</div>
        </div>
      </div>
    `;
  }

  renderTemplatesList() {
    const templates = this.templates;

    return templates
      .map(
        (template) => `
      <div class="template-card">
        <div class="template-header">
          <h5>${template.name}</h5>
          <span class="template-type type-${template.type}">${template.type}</span>
        </div>
        <div class="template-info">
          <p>${template.content.substring(0, 100)}...</p>
        </div>
        <div class="template-actions">
          <button onclick="axyraKnowledgeManagementSystem.useTemplate('${template.id}')">Usar</button>
          <button onclick="axyraKnowledgeManagementSystem.editTemplate('${template.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  performSearch(query) {
    if (!query.trim()) {
      document.getElementById('search-results').innerHTML =
        '<div class="search-placeholder">Ingresa un término de búsqueda</div>';
      return;
    }

    const results = this.searchArticles(query);
    const resultsHtml = results
      .map(
        (article) => `
      <div class="search-result">
        <h6>${article.title}</h6>
        <p>${article.summary}</p>
        <div class="result-meta">
          <span>Autor: ${article.author}</span>
          <span>Vistas: ${article.views}</span>
          <span>Fecha: ${new Date(article.metadata.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `
      )
      .join('');

    document.getElementById('search-results').innerHTML =
      resultsHtml || '<div class="no-results">No se encontraron resultados</div>';
  }

  applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const query = document.getElementById('knowledge-search').value;

    if (!query.trim()) {
      document.getElementById('search-results').innerHTML =
        '<div class="search-placeholder">Ingresa un término de búsqueda</div>';
      return;
    }

    const results = this.searchArticles(query, {
      categoryId: categoryFilter || undefined,
      status: statusFilter || undefined,
    });

    const resultsHtml = results
      .map(
        (article) => `
      <div class="search-result">
        <h6>${article.title}</h6>
        <p>${article.summary}</p>
        <div class="result-meta">
          <span>Autor: ${article.author}</span>
          <span>Vistas: ${article.views}</span>
          <span>Fecha: ${new Date(article.metadata.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `
      )
      .join('');

    document.getElementById('search-results').innerHTML =
      resultsHtml || '<div class="no-results">No se encontraron resultados</div>';
  }

  showCreateArticleDialog() {
    const title = prompt('Título del artículo:');
    if (title) {
      const content = prompt('Contenido del artículo:');
      const categoryId = prompt('ID de la categoría:');
      this.createArticle({ title, content, categoryId });
    }
  }

  showCreateCategoryDialog() {
    const name = prompt('Nombre de la categoría:');
    if (name) {
      const description = prompt('Descripción de la categoría:');
      this.createCategory({ name, description });
    }
  }

  showArticleDetails(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      alert(
        `Artículo: ${article.title}\nResumen: ${article.summary}\nAutor: ${article.author}\nVistas: ${article.views}\nMe Gusta: ${article.likes}`
      );
    }
  }

  editArticle(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      const newTitle = prompt('Nuevo título:', article.title);
      if (newTitle) {
        article.title = newTitle;
        this.saveArticles();
      }
    }
  }

  showCategoryDetails(categoryId) {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) {
      alert(`Categoría: ${category.name}\nDescripción: ${category.description}`);
    }
  }

  editCategory(categoryId) {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) {
      const newName = prompt('Nuevo nombre:', category.name);
      if (newName) {
        category.name = newName;
        this.saveCategories();
      }
    }
  }

  useTemplate(templateId) {
    const template = this.templates.find((t) => t.id === templateId);
    if (template) {
      const title = prompt('Título del artículo:');
      if (title) {
        this.createArticle({ title, content: template.content });
      }
    }
  }

  editTemplate(templateId) {
    const template = this.templates.find((t) => t.id === templateId);
    if (template) {
      const newName = prompt('Nuevo nombre:', template.name);
      if (newName) {
        template.name = newName;
        this.saveTemplates();
      }
    }
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }
}

// Inicializar sistema de conocimiento
let axyraKnowledgeManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraKnowledgeManagementSystem = new AxyraKnowledgeManagementSystem();
  window.axyraKnowledgeManagementSystem = axyraKnowledgeManagementSystem;
});

// Exportar para uso global
window.AxyraKnowledgeManagementSystem = AxyraKnowledgeManagementSystem;

