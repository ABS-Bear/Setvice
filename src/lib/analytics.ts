type AnalyticsConfig = {
  yandexMetrikaId?: string;
  trackLeadEvents?: boolean;
};

export function analyticsScript(config: AnalyticsConfig) {
  const id = String(config.yandexMetrikaId || '').trim();
  const hasMetrika = /^\d+$/.test(id);

  return `
    (() => {
      const metrikaId = ${JSON.stringify(hasMetrika ? id : '')};
      const trackLeadEvents = ${JSON.stringify(Boolean(config.trackLeadEvents))};

      window.ABServiceAnalytics = {
        goal(name, params = {}) {
          if (metrikaId && typeof window.ym === 'function') {
            window.ym(Number(metrikaId), 'reachGoal', name, params);
          }
        }
      };

      if (!trackLeadEvents) return;
      window.addEventListener('abservice:leadSubmitted', event => {
        window.ABServiceAnalytics.goal('lead_submit', event.detail || {});
      });
    })();
  `;
}
