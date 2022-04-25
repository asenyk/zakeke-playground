
import { Group } from 'zakeke-configurator-react';

export const quitFullscreen = (element: HTMLElement) => {
  const exitFullscreen = document.exitFullscreen || (document as any).webkitExitFullscreen || (document as any).msExitFullscreen || (document as any).mozCancelFullScreen;
  if (exitFullscreen)
    exitFullscreen.call(document as any);
}

export const launchFullscreen = (element: HTMLElement) => {
  const requestFullScreen = element.requestFullscreen || (element as any).webkitRequestFullscreen || (element as any).msRequestFullscreen || (element as any).mozRequestFullScreen;

  if (requestFullScreen)
    requestFullScreen.call(element);
}

export const swap = (group: Group[], i: number, j: number) => {
  let temp = group[i];
  group[i] = group[j];
  group[j] = temp;
  return group;
}

export const getDefinitiveGroups = (groups: Group[], hasCustomizeEnabled: boolean) => {

  const customizeGroup: Group = {
    id: -2,
    guid: '0000-0000-0000-0000',
    name: 'Customize',
    enabled: hasCustomizeEnabled,
    attributes: [],
    steps: [],
    cameraLocationId: '',
    displayOrder: groups.length - 1,
    direction: 0,
    attributesAlwaysOpened: false,
    imageUrl: ""
  }
  const colorGroup: Group = {
    id: -1,
    guid: '0000-0000-0000-0001',
    name: 'Color',
    enabled: hasCustomizeEnabled,
    attributes: [],
    steps: [],
    cameraLocationId: '',
    displayOrder: groups.length - 1,
    direction: 0,
    attributesAlwaysOpened: false,
    imageUrl: ""
  }

  let groupsFiltered = groups.map(group => {
    return {
      ...group, attributes: group.attributes.filter(attribute => attribute.enabled && attribute.options.some(opt => opt.enabled)).map(attribute => ({
        ...attribute,
        options: attribute.options.filter(x => x.enabled)
      }))
    }
  });

  if (hasCustomizeEnabled) {
    groupsFiltered.push(colorGroup)
    groupsFiltered.push(customizeGroup)
    return groupsFiltered;
  }
  else
    return groupsFiltered;
}

export class T {
  public static _(str: string, domain: string) {
    let gt = (window as any).gt;

    return gt ? gt.dgettext(domain, str) : str;
  }
}