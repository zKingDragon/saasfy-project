-- Inserir tags
INSERT INTO tags (name) VALUES 
('IA'), ('Produtividade'), ('Colaboração'), ('Design'), 
('Prototipagem'), ('CRM'), ('Marketing'), ('Vendas'), 
('Código'), ('Desenvolvimento'), ('Templates'), ('Comunicação'), ('Equipes');

-- Inserir SaaS de exemplo
INSERT INTO saas (name, description, category, rating, reviews_count, price, is_premium, url, is_featured) VALUES
('Notion AI', 'Workspace inteligente com IA integrada para produtividade máxima', 'productivity', 4.8, 1250, 'free', FALSE, 'https://notion.so', TRUE),
('Figma Pro', 'Design colaborativo de próxima geração com recursos avançados', 'design', 4.9, 2100, 'premium', TRUE, 'https://figma.com', TRUE),
('HubSpot CRM', 'CRM completo com automação de marketing e vendas', 'marketing', 4.6, 890, 'free', FALSE, 'https://hubspot.com', FALSE),
('VS Code AI', 'Editor de código com assistente IA para desenvolvimento', 'development', 4.7, 3200, 'free', FALSE, 'https://code.visualstudio.com', TRUE),
('Canva Pro', 'Design gráfico simplificado com templates premium', 'design', 4.5, 1800, 'premium', TRUE, 'https://canva.com', FALSE),
('Slack AI', 'Comunicação empresarial com assistente IA integrado', 'productivity', 4.4, 950, 'premium', TRUE, 'https://slack.com', FALSE);

-- Relacionar SaaS com tags
INSERT INTO saas_tags (saas_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3), -- Notion AI: IA, Produtividade, Colaboração
(2, 4), (2, 3), (2, 5), -- Figma Pro: Design, Colaboração, Prototipagem
(3, 6), (3, 7), (3, 8), -- HubSpot: CRM, Marketing, Vendas
(4, 9), (4, 1), (4, 10), -- VS Code: Código, IA, Desenvolvimento
(5, 4), (5, 11), (5, 7), -- Canva: Design, Templates, Marketing
(6, 12), (6, 1), (6, 13); -- Slack: Comunicação, IA, Equipes
